FROM python:3.5.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN set -ex \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends portaudio19-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 3000
CMD ["./main.py", "3000"]
