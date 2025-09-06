import { BookOpen, GraduationCap, Scroll, Search } from "lucide-react"

export default function ScholarLoad() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated Icons */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-600 animate-pulse" />
            <GraduationCap className="h-10 w-10 text-amber-600 animate-bounce" />
            <Scroll className="h-8 w-8 text-emerald-600 animate-pulse delay-300" />
          </div>
          <Search className="h-6 w-6 text-slate-500 absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-ping" />
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-serif font-semibold text-slate-800 dark:text-slate-200">
            Searching Scholar
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Please wait while the system is loading...
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse"></div>
        </div>

        {/* Scholarly Quote */}
        <blockquote className="text-xs italic text-slate-500 dark:text-slate-400 border-l-2 border-amber-400 pl-3">
          "The important thing is not to stop questioning." — Albert Einstein
        </blockquote>
      </div>
    </div>
  )
}
