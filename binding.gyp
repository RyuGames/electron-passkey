{
  "targets": [
    {
      "target_name": "passkey",
      "sources": [
        "src/lib/passkey.mm"
      ],
      "include_dirs": [
        "src/lib",
        "node_modules/.pnpm/node-addon-api@8.1.0/node_modules/node-addon-api"
      ],
      "link_settings": {
        "libraries": [
          "-lpthread",
          "-framework AppKit",
          "-framework ApplicationServices"
        ]
      },
      "xcode_settings": {
        "OTHER_CFLAGS": [
          "-fobjc-arc",
          "-fexceptions"
        ]
      },
      "cflags": [
        "-std=c++11",
        "-pedantic",
        "-Wall",
        "-pthread",
        "-fexceptions"
      ],
      "cflags_cc": [
        "-std=c++11",
        "-fexceptions"
      ]
    }
  ]
}