FROM ruby:2.7
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /ms_tagcloud_rails
WORKDIR /ms_tagcloud_rails
COPY ms_tagcloud_rails/Gemfile /ms_tagcloud_rails/Gemfile
COPY ms_tagcloud_rails/Gemfile.lock /ms_tagcloud_rails/Gemfile.lock
RUN bundle install
COPY ms_tagcloud_rails /ms_tagcloud_rails
EXPOSE 3000
CMD [ "bundle", "exec", "puma", "-C", "config/puma.rb" ]