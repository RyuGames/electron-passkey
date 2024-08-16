{
  "targets": [
    {
      "target_name": "passkey",
      "sources": [],
      "include_dirs": [
        "src/lib",
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api"
      ],
      "conditions": [
        ["OS=='mac'", {
          "sources": [
            "src/lib/passkey.mm"
          ],
          "link_settings": {
            "libraries": [
              "-lpthread",
              "-framework AppKit",
              "-framework ApplicationServices"
            ],
            "ldflags": ["-ObjC"]
          },
          "xcode_settings": {
            "GCC_SYMBOLS_PRIVATE_EXTERN": "YES",
            "OTHER_CFLAGS": [
              "-fobjc-arc",
              "-fexceptions"
            ],
            "OTHER_CPLUSPLUSFLAGS": [
              "-ObjC++"
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