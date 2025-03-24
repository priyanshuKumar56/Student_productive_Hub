"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Clock, Pause, Play, RotateCcw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { addNotification } from "@/redux/features/notificationsSlice"
import { updateStudyTime } from "@/redux/features/dashboardSlice"

export function PomodoroTimer() {
  const dispatch = useDispatch()
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [timerType, setTimerType] = useState("pomodoro") // pomodoro, shortBreak, longBreak
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false)

      // Send notification when timer ends
      dispatch(
        addNotification({
          id: Date.now(),
          title: timerType === "pomodoro" ? "Pomodoro Completed" : "Break Completed",
          message: timerType === "pomodoro" ? "Time to take a break!" : "Time to get back to work!",
          type: "info",
        }),
      )

      // Update study time in dashboard stats
      if (timerType === "pomodoro") {
        dispatch(updateStudyTime({ minutes: settings.pomodoro }))
      }

      // Auto switch to next timer type
      if (timerType === "pomodoro") {
        setTimerType("shortBreak")
        setTimeLeft(settings.shortBreak * 60)
      } else {
        setTimerType("pomodoro")
        setTimeLeft(settings.pomodoro * 60)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, timerType, settings, dispatch])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (timerType === "pomodoro") {
      setTimeLeft(settings.pomodoro * 60)
    } else if (timerType === "shortBreak") {
      setTimeLeft(settings.shortBreak * 60)
    } else {
      setTimeLeft(settings.longBreak * 60)
    }
  }

  const changeTimerType = (type) => {
    setIsRunning(false)
    setTimerType(type)

    if (type === "pomodoro") {
      setTimeLeft(settings.pomodoro * 60)
    } else if (type === "shortBreak") {
      setTimeLeft(settings.shortBreak * 60)
    } else {
      setTimeLeft(settings.longBreak * 60)
    }
  }

  const updateSettings = (key, value) => {
    setSettings({
      ...settings,
      [key]: value[0],
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Clock className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Pomodoro Timer</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                  <DialogDescription>Customize your timer durations</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Pomodoro: {settings.pomodoro} minutes</Label>
                    <Slider
                      value={[settings.pomodoro]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={(value) => updateSettings("pomodoro", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Break: {settings.shortBreak} minutes</Label>
                    <Slider
                      value={[settings.shortBreak]}
                      min={1}
                      max={15}
                      step={1}
                      onValueChange={(value) => updateSettings("shortBreak", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Long Break: {settings.longBreak} minutes</Label>
                    <Slider
                      value={[settings.longBreak]}
                      min={5}
                      max={30}
                      step={5}
                      onValueChange={(value) => updateSettings("longBreak", value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={resetTimer}>Apply</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-center">
            <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              variant={timerType === "pomodoro" ? "default" : "outline"}
              size="sm"
              onClick={() => changeTimerType("pomodoro")}
            >
              Pomodoro
            </Button>
            <Button
              variant={timerType === "shortBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => changeTimerType("shortBreak")}
            >
              Short Break
            </Button>
            <Button
              variant={timerType === "longBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => changeTimerType("longBreak")}
            >
              Long Break
            </Button>
          </div>

          <div className="flex justify-center space-x-2">
            <Button onClick={toggleTimer}>
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

