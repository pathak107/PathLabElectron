build: clean build_react pre_build_install_deps
	cd build && npm run dist

publish: clean build_react pre_build_cleanup
	sudo docker run --rm --name electron_windows -ti --env ELECTRON_CACHE="/root/.cache/electron"  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" --env GH_TOKEN=${GH_TOKEN} -v ${PWD}/build:/project  -v ~/.cache/electron:/root/.cache/electron  -v ~/.cache/electron-builder:/root/.cache/electron-builder  electronuserland/builder:wine


build_partial:
	cd build && npm run dist

pre_build_install_deps: pre_build_cleanup
	cd build && npm i

pre_build_cleanup:
	cd build && sudo rm -rf node_modules && sudo rm -rf dist

build_react:
	npm run build

clean:
	sudo rm -rf build