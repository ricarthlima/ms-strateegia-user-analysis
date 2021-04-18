require "uri"
require "net/http"
require 'json'

class TagCloudController < ApplicationController
    def get_cloud
        url = "https://api.strateegia.digital/projects/v1/content/" + params[:id] + "/comment/report"
        auth = request.headers["Authorization"]

        begin
            responseStrateegia = getStrateegiaInfo(url, auth)
            strInfo = transformJSONToString(responseStrateegia.body)
            responseQuickChart = generateTagCloud(strInfo)
            svg = responseQuickChart.read_body
            render xml: svg, :content_type=>"image/svg+xml"
        rescue 
            render json: {"error": "Não foi possível gerar a nuvem de tags."}
        end
        
    end

    private

    def getStrateegiaInfo(url, auth)
        url = URI(url)

        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true

        request = Net::HTTP::Get.new(url)
        request["Authorization"] = auth

        response = https.request(request)

        return response
    end

    def transformJSONToString(strBody)
        jsonList = JSON.parse(strBody)

        text = ""

        for x in 0...jsonList.length
            commentList = jsonList[x]["comments"]
            for y in 0...commentList.length
                text = text + commentList[y]["text"] + " "
                repliesList = commentList[y]["replies"]
                for z in 0...repliesList.length
                    text = text + repliesList[z]["text"] + " "
                end
            end
        end

        return text
    end

    def generateTagCloud(text)
        payload = {
            "format": "svg",
            "width": 1000,
            "height": 500,
            "fontFamily": "sans-serif",
            "fontScale": 25,
            "scale": "log",
            "rotation": 1,
            "maxNumWords": 300,
            "minNumWords": 50,
            "padding": 7,
            "colors": ["#004299", "#1A73E8"],
            "language": "pt",
            "removeStopwords": true,
            "text": text
        }

        url = URI("https://quickchart.io/wordcloud")

        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true

        request = Net::HTTP::Post.new(url)
        request["Content-Type"] = "application/json"
        request.body = payload.to_json

        return https.request(request)
    end
end
