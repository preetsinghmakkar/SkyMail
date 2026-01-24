import uuid
import boto3
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from loguru import logger

from app.modules.newsletters.template_assets.model import TemplateAsset
from app.utils import constants


class AssetService:

    @staticmethod
    def _get_s3_client():
        return boto3.client(
            's3',
            aws_access_key_id=constants.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=constants.AWS_SECRET_ACCESS_KEY,
            region_name=constants.AWS_S3_REGION,
        )

    @staticmethod
    async def upload_asset(
        company_id: str,
        template_id: str,
        file_content: bytes,
        filename: str,
        db: Session
    ) -> Tuple[bool, Optional[TemplateAsset], str]:
        try:
            s3_client = AssetService._get_s3_client()
            file_extension = filename.split(".")[-1].lower() if "." in filename else "unknown"
            s3_key = f"newsletter-assets/{company_id}/{template_id}/{uuid.uuid4()}_{filename}"

            s3_client.put_object(
                Bucket=constants.AWS_S3_BUCKET,
                Key=s3_key,
                Body=file_content,
            )

            file_url = f"https://{constants.AWS_S3_BUCKET}.s3.{constants.AWS_S3_REGION}.amazonaws.com/{s3_key}"

            asset = TemplateAsset(
                id=uuid.uuid4(),
                company_id=uuid.UUID(company_id),
                template_id=uuid.UUID(template_id),
                file_url=file_url,
                file_type=file_extension,
            )

            db.add(asset)
            db.commit()
            db.refresh(asset)

            logger.info(f"Asset uploaded for template {template_id}: {file_url}")
            return True, asset, "Asset uploaded successfully"

        except Exception as e:
            db.rollback()
            logger.error(f"Asset upload error: {str(e)}")
            return False, None, f"Failed to upload asset: {str(e)}"

    @staticmethod
    async def delete_asset(
        company_id: str,
        asset_id: str,
        db: Session
    ) -> Tuple[bool, str]:
        try:
            asset = db.query(TemplateAsset).filter(
                TemplateAsset.id == uuid.UUID(asset_id),
                TemplateAsset.company_id == uuid.UUID(company_id)
            ).first()

            if not asset:
                return False, "Asset not found"

            s3_client = AssetService._get_s3_client()
            s3_key = asset.file_url.split(f"{constants.AWS_S3_BUCKET}.s3")[-1].split(".amazonaws.com/")[-1]
            
            try:
                s3_client.delete_object(Bucket=constants.AWS_S3_BUCKET, Key=s3_key)
            except Exception as s3_err:
                logger.warning(f"S3 delete warning: {str(s3_err)}")

            db.delete(asset)
            db.commit()

            logger.info(f"Asset deleted: {asset_id}")
            return True, "Asset deleted successfully"

        except Exception as e:
            db.rollback()
            logger.error(f"Asset delete error: {str(e)}")
            return False, f"Failed to delete asset: {str(e)}"

    @staticmethod
    async def get_template_assets(
        company_id: str,
        template_id: str,
        db: Session
    ) -> List[TemplateAsset]:
        try:
            assets = db.query(TemplateAsset).filter(
                TemplateAsset.company_id == uuid.UUID(company_id),
                TemplateAsset.template_id == uuid.UUID(template_id)
            ).all()
            return assets
        except Exception as e:
            logger.error(f"Get assets error for template {template_id}: {str(e)}")
            return []
