import React, { useState } from 'react';
import { Download, Link, Loader2, CheckCircle, AlertCircle, Video, Smartphone, Instagram, PlayCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const RAPID_API_KEY = "6a116e8520msh95cfa82df8442aap1b36dbjsn2f0c1d5dddb1"; 
  const API_HOST = "instagram-reels-downloader-api.p.rapidapi.com";

  const handleDownload = async () => {
    if (!url) {
      setError('জান, লিংক পেস্ট করো!');
      return;
    }

    if (!url.includes('instagram.com/')) {
      setError('সঠিক ইনস্টাগ্রাম লিংক দাও জান!');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`https://${API_HOST}/download?url=${encodeURIComponent(url.trim())}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': API_HOST
        }
      });

      const json = await response.json();

      if (json.success && json.data) {
        let videoUrl = "";
        if (json.data.medias && json.data.medias.length > 0) {
          const videoMedia = json.data.medias.find(m => m.type === 'video');
          videoUrl = videoMedia ? videoMedia.url : json.data.url;
        } else {
          videoUrl = json.data.url;
        }

        if (videoUrl) {
          setResult({
            thumbnail: json.data.thumbnail || "",
            downloadUrl: videoUrl,
            title: json.data.title || "Instagram Video"
          });
        } else {
          setError('ভিডিও লিংক খুঁজে পাওয়া যায়নি।');
        }
      } else {
        setError('এপিআই রেসপন্স ঠিক নেই। লিংক আবার চেক করো।');
      }
    } catch (err) {
      setError('কানেকশন এরর! জেমিনি প্রিভিউতে কিছু লিমিটেশন থাকতে পারে।');
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = () => {
    if (result?.downloadUrl) {
      // এটি সরাসরি ডাউনলোড করার চেষ্টা করবে
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.target = '_blank';
      link.download = 'instagram_video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // ইউজারকে মেসেজ দেওয়া
      alert("জান, ভিডিওটি নতুন ট্যাবে ওপেন হচ্ছে। সেখান থেকে 'Save Video' অপশন ব্যবহার করো।");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#111] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-700 rounded-2xl flex items-center justify-center">
             <Instagram className="w-10 h-10 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-black italic">INSTASAVER</h1>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Post link paste koro..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-600 transition-all text-sm"
            />
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "লিংক চেক করুন"}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-[#1a1a1a] rounded-3xl border border-white/5 animate-in slide-in-from-bottom-5 duration-300">
             <div className="relative rounded-2xl overflow-hidden mb-4">
               <img src={result.thumbnail} className="w-full aspect-video object-cover" alt="Preview" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <PlayCircle className="w-10 h-10 text-white" />
               </div>
             </div>
             <button 
              onClick={triggerDownload}
              className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2"
             >
              <Smartphone className="w-5 h-5" /> সরাসরি ডাউনলোড
             </button>
          </div>
        )}
      </div>
      <p className="mt-10 text-slate-700 text-[10px] font-bold tracking-widest uppercase">Insha'Allah it will work! ❤️</p>
    </div>
  );
}

