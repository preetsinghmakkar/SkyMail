import uuid
import os
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from loguru import logger
import boto3
from botocore.exceptions import ClientError

from app.modules.auth.model import Company
from app.utils.constants import AWS_S3_BUCKET, AWS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY


class CompanyProfileService:
    """Service for company profile operations"""

    @staticmethod
    def _get_s3_client():
        """Create S3 client"""
        logger.info(f"🔌 Creating S3 client")
        logger.info(f"   Region: {AWS_S3_REGION}")
        logger.info(f"   Bucket: {AWS_S3_BUCKET}")
        logger.info(f"   Access Key: {AWS_ACCESS_KEY_ID[:10] if AWS_ACCESS_KEY_ID else 'NOT SET'}...")
        
        return boto3.client(
            "s3",
            region_name=AWS_S3_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

    @staticmethod
    async def update_company_profile(
        company_id: str,
        company_name: Optional[str],
        website_url: Optional[str],
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        """
        Update company profile information
        
        Args:
            company_id: Company UUID
            company_name: New company name
            website_url: New website URL
            db: Database session
            
        Returns:
            (success, company, message)
        """
        try:
            company = db.query(Company).filter(Company.id == uuid.UUID(company_id)).first()
            if not company:
                return False, None, "Company not found"
            
            # Update only provided fields
            if company_name:
                company.company_name = company_name
            if website_url:
                company.website_url = website_url
            
            db.commit()
            db.refresh(company)
            
            logger.info(f"Company profile updated: {company_id}")
            return True, company, "Profile updated successfully"
            
        except Exception as e:
            db.rollback()
            logger.error(f"Profile update error for {company_id}: {str(e)}")
            return False, None, "Failed to update profile"

    @staticmethod
    async def upload_profile_image(
        company_id: str,
        file_content: bytes,
        filename: str,
        db: Session
    ) -> Tuple[bool, Optional[str], str]:
        """
        Upload profile image to S3 and update company
        
        Args:
            company_id: Company UUID
            file_content: File content bytes
            filename: Original filename
            db: Database session
            
        Returns:
            (success, s3_url, message)
        """
        try:
            company = db.query(Company).filter(Company.id == uuid.UUID(company_id)).first()
            if not company:
                return False, None, "Company not found"
            
            # Generate unique S3 key
            file_ext = os.path.splitext(filename)[1].lower()
            s3_key = f"company-profiles/{company_id}/{uuid.uuid4()}{file_ext}"
            
            # Upload to S3
            s3_client = CompanyProfileService._get_s3_client()
            
            # Detect MIME type
            mime_types = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }
            content_type = mime_types.get(file_ext, 'application/octet-stream')
            
            logger.info(f"📤 Uploading to S3:")
            logger.info(f"   Bucket: {AWS_S3_BUCKET}")
            logger.info(f"   Key: {s3_key}")
            logger.info(f"   Content Type: {content_type}")
            logger.info(f"   File Size: {len(file_content)} bytes")
            
            response = s3_client.put_object(
                Bucket=AWS_S3_BUCKET,
                Key=s3_key,
                Body=file_content,
                ContentType=content_type
            )
            
            logger.info(f"✅ S3 Upload Response: {response.get('ResponseMetadata', {}).get('HTTPStatusCode')}")
            logger.info(f"   ETag: {response.get('ETag', 'N/A')}")
            
            # Delete old profile image if exists
            if company.profile_image_key:
                try:
                    s3_client.delete_object(
                        Bucket=AWS_S3_BUCKET,
                        Key=company.profile_image_key
                    )
                    logger.info(f"Deleted old profile image: {company.profile_image_key}")
                except ClientError as e:
                    logger.warning(f"Failed to delete old image: {str(e)}")
            
            # Generate S3 URL
            s3_url = f"https://{AWS_S3_BUCKET}.s3.{AWS_S3_REGION}.amazonaws.com/{s3_key}"
            
            # Update company profile_image_key
            company.profile_image_key = s3_key
            db.commit()
            db.refresh(company)
            
            logger.info(f"Profile image uploaded for {company_id}: {s3_key}")
            return True, s3_url, "Profile image uploaded successfully"
            
        except ClientError as e:
            logger.error(f"S3 upload error for {company_id}: {str(e)}")
            return False, None, "Failed to upload image to S3"
        except Exception as e:
            db.rollback()
            logger.error(f"Profile image upload error for {company_id}: {str(e)}")
            return False, None, "Failed to upload profile image"

    @staticmethod
    async def get_company_profile(
        company_id: str,
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        """
        Get company profile information
        
        Args:
            company_id: Company UUID
            db: Database session
            
        Returns:
            (success, company, message)
        """
        try:
            company = db.query(Company).filter(Company.id == uuid.UUID(company_id)).first()
            if not company:
                return False, None, "Company not found"
            
            return True, company, "Profile retrieved successfully"
            
        except Exception as e:
            logger.error(f"Profile retrieval error for {company_id}: {str(e)}")
            return False, None, "Failed to retrieve profile"
