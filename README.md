# exe-logger

Very simple logging framework that allows share the logging process through the Front-End (e.g. WEB) and Back-End (e.g.
Node.js) applications.

## Levels (`enum ExeLoggerLevel`)

Levels are arranged from the highest "OFF" to the lowest "DROWN". When the level is set to the tag or the global level
is set then only the messages with a higher level will be sent to the output.

* `OFF` - Use this level to disable the logging.
* `SEVERE` - The highest level of logging to display the most sever error messages,
* `WARNING` - The error messages that shows that on the application an error as detected, but the system can work with
  it.
* `INFO` - The important information that can help monitor the application,
* `DEBUG` - The messages that only should be displayed when searching for a bug on the application.
* `DROWN` - The huge amount of data (e.g. data stream).

## Spec (`enum ExeLoggerSpec`)

List of tags that is used to display the colored messages.

## Tagged Logger (`class ExeLoggerTagged`)

The main class of this library.

### Static fields

* `enabled` - This field can be used to enable/disable logging. _Default - true_.
* `useConsole` - The log information can be targeted to other output, so console output can be disabled to prevent
  unnecessary log output. _Default - true_.
* `mainLevel` - The global level that is used if there is no level specified for the tag. _Default - INFO_.

### Static methods

* `addTarget(target, ...levels)` - This method can be used to add the target to which the output data (messages) will be
  sent. If no level's ware defined then all messages will be sent to the target.
* `addTragetRaw(target, ...levels` - Same as `addTarget(...)` just a text will be written without the colors.
* `setLevel(level, tag?)` - This method used to specify the level for the tag, or the global level if the tag isn't
  specified.
* `getLevels()` - return the list of defined levels and the main level
* `setLevels(levels)` - set the main and the list of levels in one method

### Instance methods

* `constructor(tag, level?)` - Create an instance of `ExeLoggerTagged`.
* `getNamed(name)` - Create an new instance of Logger with the same tag extended by the defined name,
* `severe(...messages)` - Send to the output SEVERE messages.
* `warn(...messages)` - Send to the output WARNING messages.
* `info(...messages)` - Send to the output INFO messages.
* `debug(...messages)` - Send to the output DEBUG messages.
* `drown(...messages)` - Send to the output DROWN messages.

## Logger (`class ExeLogger`)

This class extends the main logging class to add functionality available on back-end.

* `constructor(filePath, level?)` - Create an instance of the logger that tag will be parsed from the filepath.
* `progress(percentage)` - Display the progress on the console output.

## Server (`class ExeLoggerServer`)

TCP server for the logging data.

## Client (`class ExeLoggerClient`)

Client that can be used to connect to the ExeLoggerServer.
