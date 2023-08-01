# Use an official Python runtime as a base image
FROM python:3.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        gettext \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy your Django app code to the container
COPY . /app/

# Expose the port your Django app will be running on (if using Channels, you may not need this)
EXPOSE 8000

# Run Django Channels development server
CMD daphne myproject.asgi:application -b 0.0.0.0 -p 8000
