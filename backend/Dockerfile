FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

# Install dependencies
# Using --no-cache-dir to keep image size down
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Create a writable directory for any temporary files if needed
RUN chmod -R 777 /code

# Expose the port that Hugging Face Spaces expects (7860)
EXPOSE 7860

# Start the Flask app using Gunicorn on port 7860
CMD ["gunicorn", "-b", "0.0.0.0:7860", "main:app"]
