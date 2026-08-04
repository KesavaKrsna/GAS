import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import DonatePage from '@/pages/DonatePage';
import NewsletterPage from '@/pages/NewsletterPage';
import LegalPage from '@/pages/LegalPage';
import ProgramsPage from '@/pages/ProgramsPage';
import TemplesPage from '@/pages/TemplesPage';
import EventsPage from '@/pages/EventsPage';
import ImpactPage from '@/pages/ImpactPage';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/programs" component={ProgramsPage} />
      <Route path="/temples" component={TemplesPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/impact" component={ImpactPage} />
      <Route path="/donate" component={DonatePage} />
      <Route path="/newsletter" component={NewsletterPage} />
      <Route path="/legal/:page" component={LegalPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
