README
======

I needed to make changes to some of the test MARs in this directory and it was a bit difficult to figure out how, so I want to document what I did so that this is easier next time. In my specific case, I wanted to rename some files in several MARs. These are approximately the steps I used to make changes to `partial_mac.mar`:

 - `./mach build` so that `<obj>/dist/bin/signmar` is available.
 - We want use the [Python MAR tool](https://github.com/mozilla-releng/build-mar) to build the replacement MAR, but it currently has a problem that we need to fix before we can build a MAR that will allow tests to pass on Apple silicon. Once [this issue](https://github.com/mozilla-releng/build-mar/issues/63) is addressed, we can just use `pip install mar`. Until then, we need to checkout the project and tweak it before we use it. First clone the repository: `cd ~ && git clone https://github.com/mozilla-releng/build-mar`. Next, we want to remove [this line](https://github.com/mozilla-releng/build-mar/blob/2d37c446015b97d6f700fef5766a49609bdc22ea/src/mardor/utils.py#L158). Then make the tweaked version available with `cd ~/build-mar && virtualenv mardor && source mardor/bin/activate && pip install .`.
 - Made a temporary working directory: `cd /path/to/mozilla/repo && mkdir temp && cd temp`
 - Extracted the MAR that I wanted to change: `mar -J -x ../toolkit/mozapps/update/tests/data/partial_mac.mar`. The `-J` specifies a compression type of `xz`. You can also specify `--auto` to automatically detect the compression type (though you may want to know the original compression later for recompression) or you can check the compression type by running `mar -T ../toolkit/mozapps/update/tests/data/partial_mac.mar` and looking for the `Compression type:` line.
 - Made the changes that I wanted to make to the extracted files. This included moving the old files to their new locations and updating those paths in `updatev2.manifest` and `updatev3.manifest`.
 - Run `mar -T ../toolkit/mozapps/update/tests/data/partial_mac.mar` to get a complete list of the files originally in that MAR as well as the product/version and channel strings (in this case `xpcshell-test` and `*` respectively).
 - Create the new MAR: `mar -J -c partial_mac_unsigned.mar -V '*' -H xpcshell-test <file1> <file2> ...`, individually specifying each file path listed in by `mar -T`, substituting with renamed paths as necessary.
 - I had a bit of trouble figuring out the signing. Eventually I discovered the following things: (a) The test MAR signatures successfully verify against `toolkit/mozapps/update/updater/xpcshellCertificate.der` and (b) according to [this comment](https://searchfox.org/mozilla-central/rev/fc00627e34639ef1014e87d9fa24091905e9dc5d/toolkit/mozapps/update/updater/moz.build#41-43), that certificate was generated from `mycert` in `modules/libmar/tests/unit/data`. Thus, I signed the MAR like this: `../<obj>/dist/bin/signmar -d ../modules/libmar/tests/unit/data -n mycert -s partial_mac_unsigned.mar partial_mac.mar`.
 - I wanted to do some verification to make sure that the new MAR looked right. First I verified the signature: `../<obj>/dist/bin/signmar -D ../toolkit/mozapps/update/updater/xpcshellCertificate.der -v partial_mac.mar`. This appears to output nothing on success, but it's probably good to check to make sure `echo $?` is `0`. I also compared the output of `mar -T partial_mac.mar` to that of the original. I saw a few unexpected size changes which I believe are likely due to slight differences in the compression used (maybe the algorithm changed slightly since this was last generated?). To make sure that these did not correspond to effective changes, I extracted the new MAR with `mkdir cmp && cd cmp && mar -J -x ../partial_mac.mar && cd ..` and compared the resulting files to make sure they had the expected contents.
 - Overwrite the original MAR with the new one and remove the `temp` directory: `cd .. && mv -f temp/partial_mac.mar toolkit/mozapps/update/tests/data/partial_mac.mar && rm -rf temp`
