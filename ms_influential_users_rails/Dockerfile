FROM ruby:2.7
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /ms_influential_users_rails
WORKDIR /ms_influential_users_rails
COPY ms_influential_users_rails/Gemfile /ms_influential_users_rails/Gemfile
COPY ms_influential_users_rails/Gemfile.lock /ms_influential_users_rails/Gemfile.lock
RUN bundle install
COPY ms_influential_users_rails /ms_influential_users_rails
EXPOSE 3000
CMD [ "bundle", "exec", "puma", "-C", "config/puma.rb" ]