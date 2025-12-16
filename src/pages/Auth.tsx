import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Snowflakes } from '@/components/Snowflakes';
import { useToast } from '@/hooks/use-toast';
import { Gift, Loader2, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: t('error'), description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    
    if (isSignup && password !== confirmPassword) {
      toast({ title: t('error'), description: 'As senhas não conferem', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignup) {
        await signup(email, password);
        toast({ title: t('success'), description: 'Conta criada com sucesso!' });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      toast({ 
        title: t('error'), 
        description: error instanceof Error ? error.message : 'Ocorreu um erro',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Snowflakes />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-4 safe-area-top">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Voltar</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md glass-card border-0 rounded-3xl overflow-hidden">
          {/* Gradient accent */}
          <div className="h-1.5 gradient-holiday" />
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 holiday-shadow">
              <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl sm:text-3xl">
              {isSignup ? t('signup') : t('login')}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignup ? t('createAccountDesc') : t('welcomeBack')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8 px-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    disabled={isLoading}
                    className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              {isSignup && (
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl btn-primary-gradient text-base font-semibold mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                {isSignup ? t('signup') : t('login')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isSignup ? t('hasAccount') : t('noAccount')}
              </span>{' '}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isSignup ? t('login') : t('signup')}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
