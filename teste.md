import React, { useState, useEffect } from 'react';
import { Play, Clock, Star, Eye, ChevronRight, Volume2, Settings, Maximize, MoreHorizontal, ThumbsUp, Share2, Bookmark, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  views: number;
  likes: number;
  instructor: {
    name: string;
    avatar: string;
    subscribers: string;
  };
  publishedAt: string;
  tags: string[];
}

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'Configuração Inicial do Sistema: Guia Completo para Iniciantes',
    description: 'Neste tutorial abrangente, você aprenderá como configurar o sistema do zero, incluindo todas as configurações essenciais, personalização da interface e primeiros passos para começar a usar a plataforma de forma eficiente.',
    duration: '12:45',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=340&fit=crop&auto=format',
    category: 'Configuração',
    difficulty: 'Iniciante',
    views: 24580,
    likes: 1247,
    instructor: {
      name: 'Maria Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format',
      subscribers: '15.2K'
    },
    publishedAt: '3 dias atrás',
    tags: ['setup', 'configuração', 'tutorial', 'iniciante']
  },
  {
    id: '2',
    title: 'Gestão Avançada de Pedidos: Workflow e Automação',
    description: 'Aprenda estratégias avançadas para gerenciar pedidos de forma eficiente.',
    duration: '18:32',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format',
    category: 'Operações',
    difficulty: 'Intermediário',
    views: 18920,
    likes: 892,
    instructor: {
      name: 'João Santos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      subscribers: '23.8K'
    },
    publishedAt: '1 semana atrás',
    tags: ['pedidos', 'workflow', 'automação']
  },
  {
    id: '3',
    title: 'Sistema de Pagamentos: Integração com Gateways',
    description: 'Como integrar diferentes gateways de pagamento ao seu sistema.',
    duration: '15:20',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop&auto=format',
    category: 'Financeiro',
    difficulty: 'Avançado',
    views: 12450,
    likes: 657,
    instructor: {
      name: 'Ana Costa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
      subscribers: '31.5K'
    },
    publishedAt: '2 semanas atrás',
    tags: ['pagamentos', 'gateway', 'integração']
  },
  {
    id: '4',
    title: 'Dashboard Analytics: Criando Relatórios Inteligentes',
    description: 'Construa dashboards profissionais com insights acionáveis.',
    duration: '22:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format',
    category: 'Analytics',
    difficulty: 'Avançado',
    views: 16780,
    likes: 924,
    instructor: {
      name: 'Carlos Lima',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
      subscribers: '19.3K'
    },
    publishedAt: '3 semanas atrás',
    tags: ['analytics', 'dashboard', 'relatórios']
  },
  {
    id: '5',
    title: 'Otimização Mobile: Responsividade e Performance',
    description: 'Técnicas para otimizar a experiência mobile do sistema.',
    duration: '14:08',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=340&fit=crop&auto=format',
    category: 'Mobile',
    difficulty: 'Intermediário',
    views: 13620,
    likes: 789,
    instructor: {
      name: 'Sofia Rodrigues',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format',
      subscribers: '12.7K'
    },
    publishedAt: '1 mês atrás',
    tags: ['mobile', 'responsivo', 'performance']
  },
  {
    id: '6',
    title: 'API e Webhooks: Integrações Avançadas',
    description: 'Como criar e gerenciar integrações robustas com APIs externas.',
    duration: '25:43',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=340&fit=crop&auto=format',
    category: 'Integrações',
    difficulty: 'Avançado',
    views: 9340,
    likes: 512,
    instructor: {
      name: 'Rafael Oliveira',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      subscribers: '8.9K'
    },
    publishedAt: '1 mês atrás',
    tags: ['API', 'webhooks', 'integrações']
  }
];

const Portal: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState<VideoTutorial>(videoTutorials[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };

  const getDifficultyColor = (difficulty: VideoTutorial['difficulty']) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400';
      case 'Intermediário':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Avançado':
        return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400';
    }
  };

  const handleVideoSelect = (video: VideoTutorial) => {
    setCurrentVideo(video);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sistema Portal
              </h1>
              <Badge variant="outline" className="text-xs">
                Tutoriais Oficiais
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com Lista de Vídeos */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Playlist do Sistema
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {videoTutorials.length} vídeos
                  </p>
                </div>
                
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {videoTutorials.map((video, index) => (
                    <div
                      key={video.id}
                      className={`p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        currentVideo.id === video.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-r-3 border-blue-500' 
                          : ''
                      }`}
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="flex space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 py-0.5">
                            <span className="text-white text-xs">{video.duration}</span>
                          </div>
                          {currentVideo.id === video.id && (
                            <div className="absolute top-1 left-1 bg-blue-500 rounded px-1 py-0.5">
                              <span className="text-white text-xs">▶</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm line-clamp-2 mb-1 ${
                            currentVideo.id === video.id 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {video.instructor.name}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {formatViews(video.views)}
                            </span>
                            <span>•</span>
                            <span>{video.publishedAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      {index < videoTutorials.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player Principal e Detalhes */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Video Player */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <div className="aspect-video bg-black relative">
                <iframe
                  src={currentVideo.videoUrl}
                  title={currentVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              {/* Video Controls Bar */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentVideo.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {formatViews(currentVideo.views)} visualizações
                    </span>
                    <span>•</span>
                    <span>{currentVideo.publishedAt}</span>
                    <Badge className={getDifficultyColor(currentVideo.difficulty)}>
                      {currentVideo.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {currentVideo.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {formatLikes(currentVideo.likes)}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="mb-6" />

              {/* Instructor Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentVideo.instructor.avatar} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {currentVideo.instructor.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentVideo.instructor.subscribers} inscritos
                    </p>
                  </div>
                </div>
                <Button>
                  Seguir
                </Button>
              </div>

              {/* Video Description */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {currentVideo.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentVideo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;