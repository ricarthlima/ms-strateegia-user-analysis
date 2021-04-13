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

    def get(self, request, contentId):

        payload = {
            "format": "svg",
            "width": 1000,
            "height": 500,
            "fontFamily": "sans-serif",
            "fontScale": 25,
            "scale": "linear",
            "rotation": 1,
            "maxNumWords": 50,
            "padding": 7,
            "colors": ["#004299", "#1A73E8"],
            "language": "pt",
            "removeStopwords": True,
            "text": "Não é o crítico que importa; não aquele homem que aponta como o homem forte fraqueja, ou onde aqueles que realizaram algo poderiam tê-lo feito melhor. O crédito pertence ao homem que encontra-se na arena, cuja face está manchada de poeira, suor e sangue; aquele que esforça-se bravamente; que erra, que se depara com um revés após o outro, pois não há esforço sem erros e falhas; aquele que esforça-se para lograr suas ações, que conhece grande entusiasmo, grandes devoções, que se entrega a uma causa nobre; que, no melhor dos casos, conhece no fim o triunfo da realização grandiosa, e que, no pior dos casos, se falhar, ao menos falha ousando grandeza, para que seu lugar jamais seja com aquelas frias e tímidas almas que de de de de de de de de não conhecem vitória ou fracasso."
        }

        print(payload)
        r = requests.post("https://quickchart.io/wordcloud",
                          data=json.dumps(payload), headers={'content-type': 'application/json'})

        return HttpResponse({r.text}, content_type='image/svg+xml')
