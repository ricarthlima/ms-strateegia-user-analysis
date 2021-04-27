require "uri"
require "net/http"
require 'json'

class RouterController < ApplicationController
    ROUTE_TAGCLOUD = "mstagcloud"
    ROUTE_INFLUENTIAL_USERS = "msinfluentialusers"
    URL_TAGCLOUD = "https://ms-strateegia-tagcloud.herokuapp.com/"
    URL_INFLUENTIAL_USERS = "https://ms-strateegia-influentialusers.herokuapp.com/"

    def router
        @route = params["route"]
        @subroute = params["subroute"]
        @parameters = params["parameters"]
        @auth = request.headers["Authorization"]

        if @route == ROUTE_INFLUENTIAL_USERS
            url = URL_INFLUENTIAL_USERS + @subroute + "/" + @parameters
            render json: makeRequest(url).body
        elsif @route == ROUTE_TAGCLOUD
            url = URL_TAGCLOUD + @subroute + "/" + @parameters
            render xml: makeRequest(url).read_body, :content_type=>"image/svg+xml"
        else
            render json: {"route": @route, "subroute": @subroute, "params": @parameters, "auth": @auth}
        end        
    end

    private

    def makeRequest(url)      
        url = URI(url)
        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true

        request = Net::HTTP::Get.new(url)
        request["Authorization"] = @auth

        response = https.request(request)

        return response
    end
end
