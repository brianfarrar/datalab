# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM debian:jessie
MAINTAINER Google Cloud DataLab

# Container configuration
EXPOSE 8080

# Path configuration
ENV PATH $PATH:/tools/node/bin:/tools/google-cloud-sdk/bin
ENV PYTHONPATH /env/python

# Setup OS and core packages
RUN echo "deb-src http://ftp.us.debian.org/debian testing main" >> /etc/apt/sources.list && \
    apt-get update -y && \
    apt-get install --no-install-recommends -y -q python unzip ca-certificates build-essential \
    libatlas-base-dev liblapack-dev gfortran libpng-dev libfreetype6-dev libxft-dev libxml2-dev \
    python-dev python-setuptools python-zmq openssh-client wget curl git pkg-config && \
    easy_install pip && \
    mkdir -p /tools && \

# Save GPL source packages
    mkdir -p /srcs && \
    cd /srcs && \
    apt-get source -d wget git python-zmq ca-certificates pkg-config libpng-dev && \
    wget --progress=dot:mega https://mirrors.kernel.org/gnu/gcc/gcc-4.9.2/gcc-4.9.2.tar.bz2 && \
    cd / && \

# Setup Python packages. Rebuilding numpy/scipy is expensive so we move this early
# to reduce the chance that prior steps can cause changes requiring a rebuild.
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir numpy==1.11.2 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir pandas==0.19.1 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir scipy==0.18.0 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir scikit-learn==0.17.1 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir sympy==0.7.6.1 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir statsmodels==0.6.1 && \

    pip install -U --upgrade-strategy only-if-needed --no-cache-dir tornado==4.4.2 \
                   --upgrade-strategy only-if-needed --no-cache-dir pyzmq==16.0.2 \
                   --upgrade-strategy only-if-needed --no-cache-dir jinja2==2.8 \
                   --upgrade-strategy only-if-needed --no-cache-dir jsonschema==2.5.1 \
                   --upgrade-strategy only-if-needed --no-cache-dir python-dateutil==2.5.0 \
                   --upgrade-strategy only-if-needed --no-cache-dir pytz==2016.7 \
                   --upgrade-strategy only-if-needed --no-cache-dir pandocfilters==1.3.0 \
                   --upgrade-strategy only-if-needed --no-cache-dir pygments==2.1.3 \
                   --upgrade-strategy only-if-needed --no-cache-dir argparse==1.2.1 \
                   --upgrade-strategy only-if-needed --no-cache-dir mock==2.0.0 \
                   --upgrade-strategy only-if-needed --no-cache-dir requests==2.9.1 \
                   --upgrade-strategy only-if-needed --no-cache-dir oauth2client==2.2.0 \
                   --upgrade-strategy only-if-needed --no-cache-dir httplib2==0.9.2 \
                   --upgrade-strategy only-if-needed --no-cache-dir futures==3.0.5 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir matplotlib==1.5.3 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir ggplot==0.6.8 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir seaborn==0.7.0 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir notebook==4.2.3 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir PyYAML==3.11 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir six==1.10.0 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir ipywidgets==5.2.2 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir future==0.15.2 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir psutil==4.3.0 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir google-api-python-client==1.5.1  && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir plotly==1.12.5 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir nltk==3.2.1 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir bs4==0.0.1 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir crcmod==1.7 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir pillow==3.4.1 && \
    find /usr/local/lib/python2.7 -type d -name tests | xargs rm -rf && \


# Setup Node.js
    mkdir -p /tools/node && \
    wget -nv https://nodejs.org/dist/v4.3.2/node-v4.3.2-linux-x64.tar.gz -O node.tar.gz && \
    tar xzf node.tar.gz -C /tools/node --strip-components=1 && \
    rm node.tar.gz && \

# Setup Google Cloud SDK
# Also apply workaround for gsutil failure brought by this version of Google Cloud.
# (https://code.google.com/p/google-cloud-sdk/issues/detail?id=538) in final step.
    wget -nv https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.zip && \
    unzip -qq google-cloud-sdk.zip -d tools && \
    rm google-cloud-sdk.zip && \
    tools/google-cloud-sdk/install.sh --usage-reporting=false \
        --path-update=false --bash-completion=false \
        --disable-installation-options && \
    tools/google-cloud-sdk/bin/gcloud -q components update \
        gcloud core bq gsutil compute preview alpha beta && \
    touch /tools/google-cloud-sdk/lib/third_party/google.py && \

# Add some unchanging bits - specifically node modules (that need to be kept in sync
# with packages.json manually, but help save build time, by preincluding them in an
# earlier layer).
# Note: ws is now over 1.0 but using that gives issues so leaving at 0.4.2 for now.
    /tools/node/bin/npm install \
        ws@0.4.32 \
        http-proxy@1.13.2 \
        mkdirp@0.5.1 \
        node-uuid@1.4.7 \
        bunyan@1.7.1 \
        tcp-port-used@0.1.2 \
        node-cache@3.2.0 && \
    cd / && \
    /tools/node/bin/npm install -g forever && \

# Clean up
    apt-get purge -y build-essential bzip2 cpp cpp-4.9 python-setuptools pkg-config libfreetype6-dev && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/lib/dpkg/info/* && \
    rm -rf /tmp/* && \
    rm -rf /root/.cache/* && \
    rm -rf /usr/share/locale/* && \
    rm -rf /usr/share/i18n/locales/* && \
    cd /

# Install TensorFlow
# Setting protobuf to 3.1.0 to workaround a tensorflow 1.0 issue in tcmalloc
RUN pip install -U --upgrade-strategy only-if-needed --no-cache-dir tensorflow==1.0 && \
    pip install -U --upgrade-strategy only-if-needed --no-cache-dir protobuf==3.1.0

# Install CloudML SDK
RUN gsutil cp gs://cloud-ml/sdk/cloudml.latest.tar.gz cloudml.latest.tar.gz && \
    pip install --upgrade-strategy only-if-needed --no-cache-dir cloudml.latest.tar.gz && \
    rm cloudml.latest.tar.gz

# Install notebook again and pin version to 4.2.3 
# ipywidgets and maybe others will update notebook to a newer version that may not work well with datalab.
# For example, kernel gateway doesn't work with 4.3.0 notebook (https://github.com/googledatalab/datalab/issues/1083)
RUN pip install -U --upgrade-strategy only-if-needed --no-cache-dir notebook==4.2.3

ADD config/ipython.py /etc/ipython/ipython_config.py
ADD config/nbconvert.py /etc/jupyter/jupyter_notebook_config.py

# Directory "py" may be empty and in that case it will git clone pydatalab from repo
ADD pydatalab /datalab/lib/pydatalab
ADD nbconvert /datalab/nbconvert

# Do IPython configuration and install build artifacts
# Then link stuff needed for nbconvert to a location where Jinja will find it.
# I'd prefer to just use absolute path in Jinja imports but those don't work.
RUN ipython profile create default && \
    jupyter notebook --generate-config && \
    if [ -d /datalab/lib/pydatalab/.git ]; then \
        echo "use local lib"; \
      else \
        git clone https://github.com/googledatalab/pydatalab.git /datalab/lib/pydatalab; \
      fi && \
    cd /datalab/lib/pydatalab && \
    /tools/node/bin/npm install -g typescript && \
    tsc --module amd --noImplicitAny --outdir datalab/notebook/static datalab/notebook/static/*.ts && \
    /tools/node/bin/npm uninstall -g typescript && \
    pip install --upgrade-strategy only-if-needed --no-cache-dir . && \
    jupyter nbextension install --py datalab.notebook && \
    jupyter nbextension enable --py widgetsnbextension && \
    rm datalab/notebook/static/*.js && \
    mkdir -p /datalab/nbconvert && \
    cp -R /usr/local/share/jupyter/nbextensions/gcpdatalab/* /datalab/nbconvert && \
    ln -s /usr/local/lib/python2.7/dist-packages/notebook/static/custom/custom.css /datalab/nbconvert/custom.css && \
    mkdir -p /usr/local/lib/python2.7/dist-packages/notebook/static/components/codemirror/mode/text/sql/text && \
    ln -s /usr/local/share/jupyter/nbextensions/gcpdatalab/codemirror/mode/sql.js /usr/local/lib/python2.7/dist-packages/notebook/static/components/codemirror/mode/text/sql/text/sql.js && \
    cd /

