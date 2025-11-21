import React from 'react';
import { Button } from './Button';

export const HistoryView: React.FC = () => (
  <div className="animate-in fade-in duration-300">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#3C3C3C] font-playfair">Scan History</h2>
      <p className="text-gray-500">View logs of previous resume analysis sessions.</p>
    </div>

    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-8 text-center">
        <div className="text-6xl mb-4 grayscale opacity-50">📜</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Past History Found</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Your scan history is stored locally. Complete a "New Scan" to see records appear here.
        </p>
        <div className="overflow-x-auto text-left opacity-50 pointer-events-none blur-[1px] select-none">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Job Title</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Candidates</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="p-4 text-gray-600">Oct {10 + i}, 2023</td>
                  <td className="p-4 text-gray-800 font-medium">Senior Developer</td>
                  <td className="p-4 text-gray-600">{5 * i} Files</td>
                  <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export const SettingsView: React.FC = () => (
  <div className="animate-in fade-in duration-300 max-w-2xl">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#3C3C3C] font-playfair">Settings</h2>
      <p className="text-gray-500">Manage your application preferences and configurations.</p>
    </div>

    <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-100">
      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#3C3C3C]">Email Notifications</h3>
          <p className="text-sm text-gray-500">Receive a summary email after every batch analysis.</p>
        </div>
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200 cursor-pointer">
           <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200"></div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#3C3C3C]">Strict Mode Analysis</h3>
          <p className="text-sm text-gray-500">Use more rigorous criteria for matching skills (Gemini 2.0 Pro).</p>
        </div>
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-[#B9A121] cursor-pointer">
           <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200"></div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[#3C3C3C]">Dark Mode</h3>
          <p className="text-sm text-gray-500">Switch interface to dark theme.</p>
        </div>
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200 cursor-pointer">
           <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200"></div>
        </div>
      </div>

       <div className="p-6">
          <h3 className="font-bold text-[#3C3C3C] mb-2">API Configuration</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your Gemini API Key settings.</p>
          <div className="flex gap-2">
            <input type="password" value="************************" disabled className="flex-1 p-2 border rounded bg-gray-50 text-gray-400" />
            <Button variant="outline">Update Key</Button>
          </div>
       </div>
    </div>

    <div className="mt-6 flex justify-end gap-4">
      <Button variant="outline">Reset Defaults</Button>
      <Button>Save Changes</Button>
    </div>
  </div>
);

export const HelpView: React.FC = () => (
  <div className="animate-in fade-in duration-300 max-w-4xl">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#3C3C3C] font-playfair">Help & Support</h2>
      <p className="text-gray-500">Guides, FAQs and contact support.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-bold text-[#3C3C3C] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-[#B9A121]">
              <span>How does the score calculation work?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              We use Google's Gemini AI to semantically compare the resume content against the job description. It looks for direct skill matches, experience relevance, and implied soft skills.
            </div>
          </details>
          <hr className="border-gray-100"/>
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-[#B9A121]">
              <span>What file formats are supported?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              Currently, we support PDF, DOCX, and TXT files. Scanned PDFs (images) are also supported via Gemini's vision capabilities.
            </div>
          </details>
          <hr className="border-gray-100"/>
           <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-[#B9A121]">
              <span>Is my data private?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="text-gray-500 text-sm mt-2 leading-relaxed">
              Yes. Files are processed in memory and sent securely to the API. We do not store your resumes on our servers permanently.
            </div>
          </details>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#B9A121] text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Need Direct Support?</h3>
          <p className="text-white/90 text-sm mb-4">Our support team is available Mon-Fri, 9am - 6pm EST.</p>
          <Button className="w-full bg-white text-[#B9A121] hover:bg-gray-100 border-none">Contact Support</Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-[#3C3C3C] mb-2">Documentation</h3>
          <ul className="space-y-2 text-sm text-blue-600 underline">
            <li><a href="#" className="hover:text-blue-800">User Guide PDF</a></li>
            <li><a href="#" className="hover:text-blue-800">API Integration Docs</a></li>
            <li><a href="#" className="hover:text-blue-800">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);