from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Record
from .serializers import RecordSerializer, RecordCreateUpdateSerializer, RecordStatsSerializer

class RecordPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def records_list_create_view(request):
    """記録一覧取得・作成API"""
    if request.method == 'GET':
        records = Record.objects.filter(user=request.user)
        
        # 日付範囲でフィルタリング
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            records = records.filter(date__gte=start_date)
        if end_date:
            records = records.filter(date__lte=end_date)
        
        # ページネーション
        paginator = RecordPagination()
        page = paginator.paginate_queryset(records, request)
        if page is not None:
            serializer = RecordSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = RecordSerializer(records, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # 同じ日付の既存レコードをチェック
        date = request.data.get('date')
        if date:
            try:
                existing_record = Record.objects.get(user=request.user, date=date)
                # 既存レコードがある場合は更新
                serializer = RecordCreateUpdateSerializer(existing_record, data=request.data, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    record_serializer = RecordSerializer(serializer.instance)
                    return Response(record_serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Record.DoesNotExist:
                # 既存レコードがない場合は新規作成
                pass
        
        # 新規作成
        serializer = RecordCreateUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            record_serializer = RecordSerializer(serializer.instance)
            return Response(record_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def record_detail_view(request, pk):
    """記録詳細取得・更新・削除API"""
    print(f"Record detail request: user={request.user.email}, pk={pk}")
    
    try:
        record = Record.objects.get(pk=pk, user=request.user)
        print(f"Record found: {record}")
    except Record.DoesNotExist:
        print(f"Record not found for user={request.user.email}, pk={pk}")
        
        # 同じIDで他のユーザーのレコードがあるかチェック
        try:
            other_record = Record.objects.get(pk=pk)
            print(f"Record exists but belongs to different user: {other_record.user.email}")
        except Record.DoesNotExist:
            print(f"Record with pk={pk} does not exist at all")
            
        return Response({'error': '記録が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = RecordSerializer(record)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = RecordCreateUpdateSerializer(record, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            record_serializer = RecordSerializer(serializer.instance)
            return Response(record_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        record.delete()
        return Response({'message': '記録を削除しました'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home_stats_view(request):
    """ホーム画面用統計API"""
    user_records = Record.objects.filter(user=request.user).order_by('-date')
    
    # 基本統計
    total_records = user_records.count()
    if total_records == 0:
        return Response({
            'averageSatisfaction': 0,
            'yesterdaySatisfaction': None,
            'consecutiveDays': 0
        })
    
    # 平均満足度（既に0-4スケール）
    avg_satisfaction = user_records.aggregate(avg=Avg('satisfaction_level'))['avg'] or 0
    
    # 昨日の満足度（既に0-4スケール）
    yesterday = timezone.now().date() - timedelta(days=1)
    yesterday_record = user_records.filter(date=yesterday).first()
    yesterday_satisfaction = yesterday_record.satisfaction_level if yesterday_record else None
    
    # 連続記録日数の計算を改善
    consecutive_days = 0
    if total_records > 0:
        today = timezone.now().date()
        current_date = today
        
        # 今日から遡って連続記録日数をカウント
        while True:
            if user_records.filter(date=current_date).exists():
                consecutive_days += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        # 今日の記録がない場合は昨日から開始
        if consecutive_days == 0:
            current_date = today - timedelta(days=1)
            while user_records.filter(date=current_date).exists():
                consecutive_days += 1
                current_date -= timedelta(days=1)
    
    return Response({
        'averageSatisfaction': round(avg_satisfaction, 1),
        'yesterdaySatisfaction': yesterday_satisfaction,
        'consecutiveDays': consecutive_days
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ranking_view(request):
    """ランキング表示用API - 全ユーザーのランキング"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # 全ユーザーの統計データを取得
    user_stats = []
    all_users = User.objects.all()
    
    for user in all_users:
        user_records = Record.objects.filter(user=user)
        total_records = user_records.count()
        
        if total_records > 0:
            # 平均満足度を計算
            avg_satisfaction = user_records.aggregate(avg=Avg('satisfaction_level'))['avg'] or 0
            
            # 総満足度（累計）を計算
            total_satisfaction = sum(record.satisfaction_level for record in user_records)
            
            user_stats.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'totalSatisfaction': total_satisfaction,
                'averageSatisfaction': round(avg_satisfaction, 1),
                'totalRecords': total_records
            })
    
    # 総満足度で降順ソート
    user_stats.sort(key=lambda x: x['totalSatisfaction'], reverse=True)
    
    # ランク付け
    for i, stats in enumerate(user_stats):
        stats['rank'] = i + 1
    
    return Response(user_stats)
