"""
Resume file parser.
Extracts raw text from uploaded PDF and DOCX files.
Text is passed downstream to the AI skill extractor and ATS analyzer.
"""
import io
from fastapi import UploadFile


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Read all pages from a PDF and return concatenated plain text."""
    import pdfplumber
    content = await file.read()
    text_parts = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
    return "\n".join(text_parts)


async def extract_text_from_docx(file: UploadFile) -> str:
    """Read all paragraphs from a DOCX file and return concatenated plain text."""
    from docx import Document
    content = await file.read()
    doc = Document(io.BytesIO(content))
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())


async def parse_resume_file(file: UploadFile) -> str:
    """Dispatch to the correct parser based on file extension."""
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        return await extract_text_from_pdf(file)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        return await extract_text_from_docx(file)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")
