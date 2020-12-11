# Bang, Echo!

A simple utility that echo's what you type into a new `ChatMessage`. The magic of this module is that it will evaluate any `@data.parameters` that you pass it.

Usage: `!echo [options] <message...>`

Bang, Echo! can be passed the following options:

```
-h, --help                     Outputs the help message in chat
-a, --actor <actor-name>       Provide the name of an actor to pull roll data from. Surround names that use multiple words with quotation marks ("")
-i, --item <item-name>         Provide the name of an item that the current actor owns to pull roll data for.
```

Bang, Echo! will attempt to collect the roll data for the currently selected actor. You can override this by adding the `--actor <actor-name>` option and provide the name of the actor that you would like to pull data from. The name must match exactly, so "John Doe" and "jOhN DoE" are treated differently. If no actor is currently selected or you don't pass in the name of an actor you'd like to use, then Bang, Echo! will display the help message.

You can pass in the name of an item by using the `--item <item-name>` argument. The name must match exactly, like the actor name above. Passing in the name of an item allows you to use `@item.property.value` syntax in your echo call.

Some examples:

`!echo John Doe has a strength modifier of +@abilities.str.mod`

This will output "John Doe has a strength modifier of +3".

`!echo -a "John Doe" John Doe has a modifier of +@skills.pil.mod in Piloting.`

This will output "John Doe has a modifier of +12 in Piloting."

`!echo -i "Laser rifle, azimuth" The laser rifle has @item.capacity.value shots of @item.capacity.max left.`

This will output "The laser rifle has 15 shots of 20 left."

This module should be compatible with any system.