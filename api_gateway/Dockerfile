FROM ruby:2.7
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /api_gateway
WORKDIR /api_gateway
COPY api_gateway/Gemfile /api_gateway/Gemfile
COPY api_gateway/Gemfile.lock /api_gateway/Gemfile.lock
RUN bundle install
COPY api_gateway /api_gateway
EXPOSE 3000
CMD [ "bundle", "exec", "puma", "-C", "config/puma.rb" ]