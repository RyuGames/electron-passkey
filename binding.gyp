{
  "targets": [
    {
      "target_name": "passkey",
      "sources": [
        "src/lib/passkey.mm"
      ],
      "include_dirs": [
        "src/lib",
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api",
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api",
      ],
      "conditions": [
        ["OS=='mac'", {
          "link_settings": {
            "libraries": [
              "-lpthread",
              "-framework AppKit",
              "-framework ApplicationServices"
            ]
          },
          "xcode_settings": {
            "GCC_SYMBOLS_PRIVATE_EXTERN": "YES",
            "OTHER_CFLAGS": [
              "-fobjc-arc",
              "-fexceptions"
            ]
          }
        }],
        ["OS=='linux'", {
          "defines": [
            "_GNU_SOURCE"
          ],
          "link_settings": {
            "libraries": [
              "-lxcb", "-lpthread"
            ]
          }
        }]
      ],
      "cflags": [
        "-std=c++11",
        "-pedantic",
        "-Wall",
        "-pthread",
        "-fexceptions"
      ],
      "cflags+": ["-fvisibility=hidden"],
      "cflags_cc": [
        "-std=c++11",
        "-fexceptions"
      ]
    }
  ]
}