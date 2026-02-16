import { Router, Route } from 'preact-router';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ADnD from './pages/ADnD';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:slug" component={Projects} />
          <Route path="/adnd" component={ADnD} />
          <Route path="/adnd/:slug" component={ADnD} />
        </Router>
      </main>
      
      <Footer />
    </div>
  );
}
