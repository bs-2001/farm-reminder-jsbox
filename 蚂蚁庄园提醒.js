const debug = 0

var query = $context.query
if (query.isClicked) {
  $app.openURL("alipays://platformapi/startapp?appId=66666674")
  $cache.clear()
  $app.close()
}

var expired = $cache.get("timer")
if (expired) {
  var date = new Date()
  if (date.getTime() - expired.getTime() >= 0) {
    $cache.clear()
  }
}

var reminders = ["🐤30", "🐤15", "🚫", "🥣270", "🥣210"]

if (debug == 1) {
  reminders.push("debug")
}

var notices = [{
    timer: 30 * 60,
    info: "可能有小鸡来偷吃了"
  },
  {
    timer: 15 * 60,
    info: "可能有小鸡来偷吃了"
  },
  {
    timer: 0,
    info: ""
  },
  {
    timer: 210 * 60,
    info: "小鸡可能吃完了"
  },
  {
    timer: 150 * 60,
    info: "小鸡可能吃完了"
  },
  {
    timer: 15,
    info: "可能有小鸡来偷吃了"
  }
]

var currentReminder = $cache.get("cr")

if (!currentReminder) {
  currentReminder = 2
} else {
  currentReminder -= 1
}

$ui.render({
  props: {
    title: "蚂蚁庄园提醒"
  },
  views: [{
    type: "tab",
    props: {
      items: reminders,
      index: currentReminder,
    },
    layout: function(make) {
      make.left.top.inset(10)
    },
    events: {
      changed: function(sender) {
        setReminder(sender.index)
      }
    }
  }]
})

function setReminder(idx) {
  if (currentReminder) {
    var dn = notices[currentReminder]
    $push.cancel({
      title: "蚂蚁庄园提醒",
      body: dn.info
    })
  }
  var cn = notices[idx]
  $cache.set("cr", idx + 1)

  if (cn.timer) {
    var date = new Date()
    date.setTime(date.getTime() + cn.timer * 1000)
    $cache.set("timer", date)
    $push.schedule({
      title: "蚂蚁庄园提醒",
      body: cn.info,
      delay: cn.timer,
      script: "蚂蚁庄园提醒",
      query: {
        isClicked: true
      }
    })
  }
  if ($app.env != $env.today) {
    $app.close()
  }
}