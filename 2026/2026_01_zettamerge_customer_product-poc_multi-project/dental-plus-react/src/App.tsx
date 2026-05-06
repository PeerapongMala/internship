import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { Layout } from './components/layout';

// Head Admin Pages
import {
  Dashboard,
  AIChatbot,
  Analytics,
  MessageLogs,
  Settings,
  QuickReplies,
  Clinic,
  FAQ,
} from './pages/HeadAdmin';

// Admin Pages
import { ChatTaskManagement } from './pages/Admin';

// Staff Clinic Pages
import { ClinicBranch } from './pages/StaffClinic';

// Other Pages
import { ChatManagement, ChatDispatchCenter, Dispatch } from './pages/Other';

// Customer Pages
import { FAQList, AIChat } from './pages/Customer';

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Layout>
          <Routes>
            {/* Default redirect to AI Chatbot */}
            <Route path="/" element={<Navigate to="/ai-chatbot" replace />} />

            {/* Head Admin */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-chatbot" element={<AIChatbot />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/message-logs" element={<MessageLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/quick-replies" element={<QuickReplies />} />
            <Route path="/clinic" element={<Clinic />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Admin */}
            <Route path="/chat-task-management" element={<ChatTaskManagement />} />

            {/* Staff Clinic */}
            <Route path="/clinic-branch" element={<ClinicBranch />} />

            {/* Other */}
            <Route path="/chat-management" element={<ChatManagement />} />
            <Route path="/chat-dispatch-center" element={<ChatDispatchCenter />} />
            <Route path="/dispatch" element={<Dispatch />} />

            {/* Customer */}
            <Route path="/faq-all" element={<FAQList />} />
            <Route path="/chat" element={<AIChat />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/ai-chatbot" replace />} />
          </Routes>
        </Layout>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
