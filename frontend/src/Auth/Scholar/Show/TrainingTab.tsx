"use client"

import { UseScholarShow } from "@/Actions/ScholarAction"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GraduationCap, Calendar, User, BookOpen } from "lucide-react"

export default function TrainingTab() {
  const { trainings } = UseScholarShow()

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Training Records</h2>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-green-500 text-green-600 hover:text-white hover:bg-green-500 transition-colors w-fit"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            {trainings?.length || 0} Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {trainings && trainings.length > 0 ? (
          <>
            <div className="hidden md:grid md:grid-cols-3 gap-4 px-6 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <BookOpen className="h-4 w-4" />
                Training Name
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Date Completed
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Instructor
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {trainings.map((training: any, index: number) => (
                <div key={index} className="group hover:bg-gray-50 transition-colors duration-150">
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-3 gap-4 px-6 py-4 items-center">
                    <div className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">
                      {training.name}
                    </div>
                    <div className="text-gray-600 text-sm">{training.date}</div>
                    <div className="text-gray-600 text-sm">{training.trainor}</div>
                  </div>

                  <div className="md:hidden px-6 py-4 space-y-3">
                    <div className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">
                      {training.name}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{training.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{training.trainor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No training records yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Scholar's completed training sessions will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
