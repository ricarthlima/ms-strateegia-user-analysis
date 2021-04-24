require "uri"
require "net/http"
require 'json'
require "#{Rails.root}/lib/author.rb"
require "#{Rails.root}/lib/kit.rb"

class InfluentialUsersController < ApplicationController
    def getInfluentialUsers
        # Infos
        url = "https://api.strateegia.digital/projects/v1/content/" + params[:id] + "/comment/report"
        auth = request.headers["Authorization"]

        # Request to Strateegia (get Response)
        responseStrateegia = makeRequestStrateegia(url, auth)                
        @str_json = responseStrateegia.body
        @json = JSON.parse(@str_json)

        # Recipes to Manipulate
        @authors = Array.new
        @kit_data = Kit.new        

        # Get Authors Data
        getAuthorsData()

        # Get Kit Data
        getKitData()

        # Get Score
        getScore()

        # Sort by score
        @authors.sort{|a,b| b.score <=> a.score}

        # Output render
        render json: {"kit": @kit_data, "authors": @authors}
    end

    private

    def makeRequestStrateegia(url, auth)
        url = URI(url)

        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true

        request = Net::HTTP::Get.new(url)
        request["Authorization"] = auth

        response = https.request(request)

        return response
    end

    def getAuthorsData()     
        for iterator_question in 0...@json.length
            comments_list = @json[iterator_question]["comments"]            

            # To calculate how many questions each author commented
            id_authors_ans_this_question = Array.new

            
            for iterator_comment in 0...comments_list.length
                comment = comments_list[iterator_comment]

                # Verify if author is in list
                possible_author = @authors.detect{|a| a.id == comment["author"]["id"]}
                if possible_author != nil
                    author_index = @authors.find_index{|a| a.id == comment["author"]["id"]}

                    if !id_authors_ans_this_question.find_index.include?(@authors[author_index].id)
                        @authors[author_index].amount_ans_questions += 1
                        id_authors_ans_this_question.push(@authors[author_index].id)
                    end

                    @authors[author_index].amount_comments += 1
                    @authors[author_index].total_agreements += comment["agreements"].length
                    @authors[author_index].bigger_amount_agreements = [comment["agreements"].length,@authors[author_index].bigger_amount_agreements].max
                    @authors[author_index].total_inner_replys += comment["reply_count"]
                    @authors[author_index].bigger_amout_inner_replys = [comment["reply_count"], @authors[author_index].bigger_amout_inner_replys].max
                    

                else
                    author = Author.new
                    author.id = comment["author"]["id"]
                    author.name = comment["author"]["name"]
                    author.amount_ans_questions =  1
                    author.amount_comments = 1
                    author.total_agreements = comment["agreements"].length
                    author.bigger_amount_agreements = comment["agreements"].length
                    author.total_inner_replys = comment["reply_count"]
                    author.bigger_amout_inner_replys = comment["reply_count"]

                    @authors.push(author)

                    id_authors_ans_this_question.push(author.id)
                end
            end
        end
    end

    def getKitData()
        # Get Amount Questions
        @kit_data.amount_questions = @json.length

        # Initial data   
        @kit_data.total_comments = 0
        @kit_data.total_agreements = 0
        @kit_data.total_replys = 0        
        
        for iterator_question in 0...@json.length
            comments_list = @json[iterator_question]["comments"] 
            @kit_data.total_comments += comments_list.length

            for iterator_comment in 0...comments_list.length
                comment = comments_list[iterator_comment]
                @kit_data.total_agreements += comment["agreements"].length
                @kit_data.total_replys += comment["reply_count"]
            end
        end

        # Amout users
        @kit_data.total_users = @authors.length
        @kit_data.average_agreements_per_comment = (@kit_data.total_agreements.to_f/@kit_data.total_comments.to_f)
        
        # User data
        @kit_data.average_inner_replys_per_user = 0
        for iterator_author in 0...@authors.length
            @kit_data.average_inner_replys_per_user += @authors[iterator_author].total_inner_replys
        end
        @kit_data.average_inner_replys_per_user = @kit_data.average_inner_replys_per_user.to_f / @authors.length.to_f
    end

    def getScore()
        for iterator_author in 0...@authors.length
            author = @authors[iterator_author]

            f1 = author.amount_ans_questions.to_f / @kit_data.amount_questions.to_f
            f2 = [3, (author.amount_comments.to_f / @kit_data.total_comments.to_f) * @kit_data.total_users].min

            f3 = author.total_agreements.to_f / @kit_data.total_agreements.to_f
            f4 = author.bigger_amount_agreements.to_f / @kit_data.average_agreements_per_comment.to_f
            if f4 > 5 
                f4 = 1.25
            elsif f4 > 3
                f4 = 1
            elsif f4 > 1
                f4 = 0.75
            else
                f4 = 0
            end

            f5 = author.total_inner_replys.to_f / @kit_data.total_replys.to_f
            f6 = author.bigger_amout_inner_replys.to_f / @kit_data.average_inner_replys_per_user.to_f
            if f6 > 5 
                f6 = 1.25
            elsif f6 > 3
                f6 = 1
            elsif f6 > 1
                f6 = 0.75
            else
                f6 = 0
            end

            @authors[iterator_author].score = (((f1 * 2 + f2)/4) + ((f3*2 + f4)/4 + (f5*2 + f6)/4))/3
        end
    end
end
