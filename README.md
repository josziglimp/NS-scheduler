# NS-scheduler
Modification of Nightscout Heroku Config Vars based on weekly schedule in GSheet

## Environment (Config) Variables that might be practical *to modify on a schedule*
(repeat of selected info from [here](https://github.com/nightscout/cgm-remote-monitor#environment))

#### *High/Low Alarms* and related variables

  These alarm setting effect all delivery methods (browser, pushover, maker, etc), some settings can be overridden per client (web browser)
  BG values are automatically converted to the mg/dl required by Nightscout as set on the `Setting` tab of the Sheet.

  * `BG_HIGH` (`260`) - must be set using mg/dl units; the high BG outside the target range that is considered urgent
  * `BG_TARGET_TOP` (`180`) - must be set using mg/dl units; the top of the target range, also used to draw the line on the chart
  * `BG_TARGET_BOTTOM` (`80`) - must be set using mg/dl units; the bottom of the target range, also used to draw the line on the chart
  * `BG_LOW` (`55`) - must be set using mg/dl units; the low BG outside the target range that is considered urgent
  * `ALARM_URGENT_HIGH` (`on`) - possible values `on` or `off`
  * `ALARM_URGENT_HIGH_MINS` (`30 60 90 120`) - Number of minutes to snooze urgent high alarms, space separated for options in browser, first used for pushover
  * `ALARM_HIGH` (`on`) - possible values `on` or `off`
  * `ALARM_HIGH_MINS` (`30 60 90 120`) - Number of minutes to snooze high alarms, space separated for options in browser, first used for pushover
  * `ALARM_LOW` (`on`) - possible values `on` or `off`
  * `ALARM_LOW_MINS` (`15 30 45 60`) - Number of minutes to snooze low alarms, space separated for options in browser, first used for pushover
  * `ALARM_URGENT_LOW` (`on`) - possible values `on` or `off`
  * `ALARM_URGENT_LOW_MINS` (`15 30 45`) - Number of minutes to snooze urgent low alarms, space separated for options in browser, first used for pushover

#### *Not high or low alarm* snooze times

* `ALARM_URGENT_MINS` (`30 60 90 120`) - Number of minutes to snooze urgent alarms (that aren't tagged as high or low), space separated for options in browser, first used for pushover
  * `ALARM_WARN_MINS` (`30 60 90 120`) - Number of minutes to snooze warning alarms (that aren't tagged as high or low), space separated for options in browser, first used for pushover

#### Predefined values for your browser settings (optional)
  * `CUSTOM_TITLE` (`Nightscout`) - Could theoretically be used as a status message

##### `upbat` (Uploader Battery)
  Displays the most recent battery status from the uploader phone. . Use these [extended setting](#extended-settings) to adjust behavior:
  * `UPBAT_ENABLE_ALERTS` (`false`) - Set to `true` to enable uploader battery alarms via Pushover and IFTTT.
  * `UPBAT_WARN` (`30`) - Minimum battery percent to trigger warning.
  * `UPBAT_URGENT` (`20`) - Minimum battery percent to trigger urgent alarm.

##### `timeago` (Time Ago) - Stale sensor data
  Displays the time since last CGM entry. Use these [extended setting](#extended-settings) to adjust behavior:
  * `TIMEAGO_ENABLE_ALERTS` (`false`) - Set to `true` to enable stale data alarms via Pushover and IFTTT.
  * `ALARM_TIMEAGO_WARN` (`on`) - possible values `on` or `off`
  * `ALARM_TIMEAGO_WARN_MINS` (`15`) - minutes since the last reading to trigger a warning
  * `ALARM_TIMEAGO_URGENT` (`on`) - possible values `on` or `off`
  * `ALARM_TIMEAGO_URGENT_MINS` (`30`) - minutes since the last reading to trigger a urgent alarm

##### `errorcodes` (CGM Error Codes)
  Generates alarms for CGM codes `9` (hourglass) and `10` (???).
  * Use [extended settings](#extended-settings) to adjust what errorcodes trigger notifications and alarms:
    * `ERRORCODES_INFO` (`1 2 3 4 5 6 7 8`) - By default the needs calibration (blood drop) and other codes below 9 generate an info level notification, set to a space separate list of number or `off` to disable
    * `ERRORCODES_WARN` (`off`) - By default there are no warning configured, set to a space separate list of numbers or `off` to disable
    * `ERRORCODES_URGENT` (`9 10`) - By default the hourglass and ??? generate an urgent alarm, set to a space separate list of numbers or `off` to disable

##### `ar2` (AR2 Forecasting)
  Generates alarms based on forecasted values. See [Forecasting using AR2 algorithm](https://github.com/nightscout/nightscout.github.io/wiki/Forecasting)
  * Enabled by default if no thresholds are set **OR** `ALARM_TYPES` includes `predict`.
  * Use [extended settings](#extended-settings) to adjust AR2 behavior:
    * `AR2_CONE_FACTOR` (`2`) - to adjust size of cone, use `0` for a single line.

#### Advanced Plugins:

##### `bwp` (Bolus Wizard Preview) - *NOT tested with Scheduler; MUST be tested before use*
  This plugin in intended for the purpose of automatically snoozing alarms when the CGM indicates high blood sugar but there is also insulin on board (IOB) and secondly, alerting to user that it might be beneficial to measure the blood sugar using a glucometer and dosing insulin as calculated by the pump or instructed by trained medicare professionals. ***The values provided by the plugin are provided as a reference based on CGM data and insulin sensitivity you have configured, and are not intended to be used as a reference for bolus calculation.*** The plugin calculates the bolus amount when above your target, generates alarms when you should consider checking and bolusing, and snoozes alarms when there is enough IOB to cover a high BG. Uses the results of the `iob` plugin and `sens`, `target_high`, and `target_low` fields from the [treatment profile](#treatment-profile). Defaults that can be adjusted with [extended setting](#extended-settings)
  * `BWP_WARN` (`0.50`) - If `BWP` is > `BWP_WARN` a warning alarm will be triggered.
  * `BWP_URGENT` (`1.00`) - If `BWP` is > `BWP_URGENT` an urgent alarm will be triggered.
  * `BWP_SNOOZE_MINS` (`10`) - minutes to snooze when there is enough IOB to cover a high BG.
  * `BWP_SNOOZE` - (`0.10`) If BG is higher then the `target_high` and `BWP` < `BWP_SNOOZE` alarms will be snoozed for `BWP_SNOOZE_MINS`.

##### `cage` (Cannula Age)
  Calculates the number of hours since the last `Site Change` treatment that was recorded.
  * `CAGE_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications to remind you of upcoming cannula change.
  * `CAGE_INFO` (`44`) - If time since last `Site Change` matches `CAGE_INFO`, user will be warned of upcoming cannula change
  * `CAGE_WARN` (`48`) - If time since last `Site Change` matches `CAGE_WARN`, user will be alarmed to to change the cannula
  * `CAGE_URGENT` (`72`) - If time since last `Site Change` matches `CAGE_URGENT`, user will be issued a persistent warning of overdue change.

#####  `sage` (Sensor Age)
  Calculates the number of days and hours since the last `Sensor Start` and `Sensor Change` treatment that was recorded.
  * `SAGE_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications to remind you of upcoming sensor change.
  * `SAGE_INFO` (`144`) - If time since last sensor event matches `SAGE_INFO`, user will be warned of upcoming sensor change
  * `SAGE_WARN` (`164`) - If time since last sensor event matches `SAGE_WARN`, user will be alarmed to to change/restart the sensor
  * `SAGE_URGENT` (`166`) - If time since last sensor event matches `SAGE_URGENT`, user will be issued a persistent warning of overdue change.

##### `iage` (Insulin Age)
  Calculates the number of days and hours since the last `Insulin Change` treatment that was recorded.
  * `IAGE_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications to remind you of upcoming insulin reservoir change.
  * `IAGE_INFO` (`44`) - If time since last `Insulin Change` matches `IAGE_INFO`, user will be warned of upcoming insulin reservoir change
  * `IAGE_WARN` (`48`) - If time since last `Insulin Change` matches `IAGE_WARN`, user will be alarmed to to change the insulin reservoir
  * `IAGE_URGENT` (`72`) - If time since last `Insulin Change` matches `IAGE_URGENT`, user will be issued a persistent warning of overdue change.

##### `bage` (Battery Age)
  Calculates the number of days and hours since the last `Pump Battery Change` treatment that was recorded.
  * `BAGE_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications to remind you of upcoming pump battery change.
  * `BAGE_DISPLAY` (`days`) - Set to `hours` to display time since last `Pump Battery Change` in hours only.
  * `BAGE_INFO` (`312`) - If time since last `Pump Battery Change` matches `BAGE_INFO` hours, user will be warned of upcoming pump battery change (default of 312 hours is 13 days).
  * `BAGE_WARN` (`336`) - If time since last `Pump Battery Change` matches `BAGE_WARN` hours, user will be alarmed to to change the pump battery (default of 336 hours is 14 days).
  * `BAGE_URGENT` (`360`) - If time since last `Pump Battery Change` matches `BAGE_URGENT` hours, user will be issued a persistent warning of overdue change (default of 360 hours is 15 days).

##### `treatmentnotify` (Treatment Notifications)
  Generates notifications when a treatment has been entered and snoozes alarms minutes after a treatment.  Default snooze is 10 minutes, and can be set using the `TREATMENTNOTIFY_SNOOZE_MINS` [extended setting](#extended-settings).

##### `pump` (Pump Monitoring)
  Generic Pump Monitoring for OpenAPS, MiniMed Connect, RileyLink, t:slim, with more on the way
  * `PUMP_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications for Pump battery and reservoir.
  * `PUMP_WARN_ON_SUSPEND` (`false`) - Set to `true` to get an alarm when the pump is suspended.
  * `PUMP_WARN_CLOCK` (`30`) - The number of minutes ago that needs to be exceed before an alert is triggered.
  * `PUMP_URGENT_CLOCK` (`60`) - The number of minutes ago that needs to be exceed before an urgent alarm is triggered.
  * `PUMP_WARN_RES` (`10`) - The number of units remaining, a warning will be triggered when dropping below this threshold.
  * `PUMP_URGENT_RES` (`5`) - The number of units remaining, an urgent alarm will be triggered when dropping below this threshold.
  * `PUMP_WARN_BATT_P` (`30`) - The % of the pump battery remaining, a warning will be triggered when dropping below this threshold.
  * `PUMP_URGENT_BATT_P` (`20`) - The % of the pump battery remaining, an urgent alarm will be triggered when dropping below this threshold.
  * `PUMP_WARN_BATT_V` (`1.35`) - The voltage (if percent isn't available) of the pump battery, a warning will be triggered when dropping below this threshold.
  * `PUMP_URGENT_BATT_V` (`1.30`) - The  voltage (if percent isn't available) of the pump battery, an urgent alarm will be triggered when dropping below this threshold.

##### `openaps` (OpenAPS) - *NOT tested with Scheduler; MUST be tested before use*
  Integrated OpenAPS loop monitoring, uses these extended settings:
  * Requires `DEVICESTATUS_ADVANCED="true"` to be set
  * `OPENAPS_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications when OpenAPS isn't looping.  If OpenAPS is going to offline for a period of time, you can add an `OpenAPS Offline` event for the expected duration from Careportal to avoid getting alerts.
  * `OPENAPS_WARN` (`30`) - The number of minutes since the last loop that needs to be exceed before an alert is triggered
  * `OPENAPS_URGENT` (`60`) - The number of minutes since the last loop that needs to be exceed before an urgent alarm is triggered

##### `loop` (Loop) - *NOT tested with Scheduler; MUST be tested before use*
  iOS Loop app monitoring, uses these extended settings:
  * Requires `DEVICESTATUS_ADVANCED="true"` to be set
  * `LOOP_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications when Loop isn't looping.
  * `LOOP_WARN` (`30`) - The number of minutes since the last loop that needs to be exceeded before an alert is triggered
  * `LOOP_URGENT` (`60`) - The number of minutes since the last loop that needs to be exceeded before an urgent alarm is triggered

##### `xdrip-js` (xDrip-js) - *NOT tested with Scheduler; MUST be tested before use*
  Integrated xDrip-js monitoring, uses these extended settings:
  * Requires `DEVICESTATUS_ADVANCED="true"` to be set
  * `XDRIP-JS_ENABLE_ALERTS` (`false`) - Set to `true` to enable notifications when CGM state is not OK or battery voltages fall below threshold.
  * `XDRIP-JS_STATE_NOTIFY_INTRVL` (`0.5`) - Set to number of hours between CGM state notifications
  * `XDRIP-JS_WARN_BAT_V` (`300`) - The voltage of either transmitter battery, a warning will be triggered when dropping below this threshold.

#### Pushover
  Pushover is configured using the following Environment Variables:

    * `PUSHOVER_USER_KEY` - Your Pushover user key, can be found in the top left of the [Pushover](https://pushover.net/) site, this can also be a pushover delivery group key to send to a group rather than just a single user.  This also supports a space delimited list of keys.  To disable `INFO` level pushes set this to `off`.
    * `PUSHOVER_ALARM_KEY` - An optional Pushover user/group key, will be used for system wide alarms (level > `WARN`).  If not defined this will fallback to `PUSHOVER_USER_KEY`.  A possible use for this is sending important messages and alarms to a CWD that you don't want to send all notification too.  This also support a space delimited list of keys.  To disable Alarm pushes set this to `off`.
    * `PUSHOVER_ANNOUNCEMENT_KEY` - An optional Pushover user/group key, will be used for system wide user generated announcements.  If not defined this will fallback to `PUSHOVER_USER_KEY` or `PUSHOVER_ALARM_KEY`.  This also support a space delimited list of keys. To disable Announcement pushes set this to `off`.
