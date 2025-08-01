from django.urls import path
from . import views

app_name = 'records'

urlpatterns = [
    path('', views.records_list_create_view, name='records_list_create'),
    path('<int:pk>/', views.record_detail_view, name='record_detail'),
    path('home-stats/', views.home_stats_view, name='home_stats'),
    path('ranking/', views.ranking_view, name='ranking'),
]
