from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from mstagcloud.tagcloud.serializers import UserSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from django.shortcuts import HttpResponse
from rest_framework.views import APIView
import requests
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class TagCloudViewSet(APIView):
    """
    API endpoint that allows generate a tagcloud from kit.
    """
    #renderer_classes = [JSONRenderer]
    permission_classes = (permissions.AllowAny,)

    # def get_queryset(self):
    #     contentId = self.kwargs['contentId']
    #     print("------------------\n" + str(contentId))
    #     return Response({'contentId': contentId})

    def clearText(self, text):
        stopWords = ["\n", "ter", "é"]
        for sw in stopWords:
            text = text.replace(sw, "")
        return text

    def getFromStrateegia(self, contentId):
        url = "https://api.strateegia.digital/projects/v1/content/" + \
            str(contentId) + "/comment/report"
        auth = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJycnNsQGNpbi51ZnBlLmJyIiwidWlkIjoiNjAwZjJjY2Y3NGIxMjgwOGMwYzE0Y2YwIiwicm9sZXMiOltdLCJuYW1lIjoiUmljYXJ0aCBSIFMgTGltYSIsImV4cCI6MTYxODMzMDgyNiwiaWF0IjoxNjE4MzE2NDI2fQ.NGvHdLHouh_jPL-XddH5JNV4k-Io0apj9p9zjBbqYdKRQ4zyEvTIqBPFEuqgHNiNzBL8ozFif8SL_FtH6vFxjQ"
        r = requests.get(
            url, headers={'content-type': 'application/json', 'Authorization': auth})

        jsonList = json.loads(r.text)
        text = ""

        for x in range(len(jsonList)):
            commentList = jsonList[x]["comments"]
            for y in range(len(commentList)):
                text = text + commentList[y]["text"] + " "

                repliesList = commentList[y]["replies"]
                for z in range(len(repliesList)):
                    text = text + repliesList[z]["text"] + " "

        return self.clearText(text)

    def generateImage(self, text):
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
            "removeStopwords": True,
            "text": text
        }
        r = requests.post("https://quickchart.io/wordcloud",
                          data=json.dumps(payload), headers={'content-type': 'application/json'})

        return HttpResponse({r.text}, content_type='image/svg+xml')

    def get(self, request, contentId):
        text = self.getFromStrateegia(contentId)
        # return HttpResponse(text, content_type='application/json')
        return self.generateImage(text)
