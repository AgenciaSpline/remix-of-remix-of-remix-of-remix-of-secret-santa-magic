import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Snowflakes } from '@/components/Snowflakes';
import { getEventsByUser, createEvent, getParticipantsByEvent, Event } from '@/lib/nocodb';
import { useToast } from '@/hooks/use-toast';
import { Gift, Plus, Users, Loader2, LogOut, Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface EventWithStats extends Event {
  totalParticipants: number;
  drawnCount: number;
}

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEventName, setNewEventName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.Id) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user?.Id) return;
    setIsLoading(true);
    try {
      const userEvents = await getEventsByUser(user.Id);
      const eventsWithStats = await Promise.all(
        userEvents.map(async (event) => {
          const participants = event.Id ? await getParticipantsByEvent(event.Id) : [];
          return {
            ...event,
            totalParticipants: participants.length,
            drawnCount: participants.filter(p => p.is_drawn).length,
          };
        })
      );
      setEvents(eventsWithStats);
    } catch (error) {
      toast({ title: t('error'), description: 'Falha ao carregar eventos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventName.trim() || !user?.Id) return;
    setIsCreating(true);
    try {
      await createEvent(user.Id, newEventName.trim());
      setNewEventName('');
      setDialogOpen(false);
      await loadEvents();
      toast({ title: t('success'), description: 'Evento criado!' });
    } catch (error) {
      toast({ title: t('error'), description: 'Falha ao criar evento', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Snowflakes />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 safe-area-top">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold">Amigo Secreto</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate max-w-[150px]">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl h-9 w-9">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 safe-area-bottom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{t('myEvents')}</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus eventos de amigo secreto</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto rounded-xl btn-primary-gradient">
                <Plus className="h-4 w-4 mr-2" />
                {t('createEvent')}
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 rounded-2xl sm:rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{t('createEvent')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder={t('eventName')}
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateEvent()}
                  className="h-12 rounded-xl"
                />
                <Button 
                  onClick={handleCreateEvent} 
                  disabled={isCreating || !newEventName.trim()} 
                  className="w-full h-12 rounded-xl btn-primary-gradient"
                >
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {t('createEvent')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50 bg-transparent rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base max-w-xs">{t('noEvents')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event, index) => (
              <Link key={event.Id} to={`/event/${event.Id}`}>
                <Card 
                  className="glass-card hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden group animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Progress indicator */}
                  {event.totalParticipants > 0 && (
                    <div className="h-1 bg-muted">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${(event.drawnCount / event.totalParticipants) * 100}%` }}
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Gift className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="font-display text-lg line-clamp-1">
                            {event.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {event.created_at ? new Date(event.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.totalParticipants} {t('participants')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-secondary">{event.drawnCount}</span>
                        <span className="text-muted-foreground">/ {event.totalParticipants} {t('drawn')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
