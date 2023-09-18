import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { glb } from '@spaceribs/buildings';

@Component({
  selector: 'spaceribs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  constructor(private zone: NgZone) {}

  @ViewChild('renderBox') private readonly renderBox?: ElementRef;

  ngAfterViewInit(): void {
    const scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    scene.fog = new THREE.Fog(0x000000, 0, 5);

    const keyLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(30, 100%, 75%)'),
      1.0,
    );
    keyLight.position.set(0, 10, -10).normalize();
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
      new THREE.Color('hsl(240, 100%, 75%)'),
      0.75,
    );
    fillLight.position.set(100, 0, 100).normalize();
    fillLight.castShadow = true;
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();
    backLight.castShadow = true;
    scene.add(backLight);

    const camera = new THREE.OrthographicCamera(
      800 / -200,
      800 / 200,
      600 / 200,
      600 / -200,
      -2,
      1000,
    );

    // const camera = new THREE.PerspectiveCamera(2, 800 / 600, 0.01, 50);
    camera.position.z = 2;
    // camera.rotation.x = -Math.PI / 3;
    // camera.rotation.y = Math.PI / 3;
    // camera.rotation.z = Math.PI / 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.setSize(800, 600);
    const renderBox = this.renderBox?.nativeElement;

    if (renderBox == null) {
      throw new Error('No renderBox element found.');
    }

    renderBox.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const glitchPass = new RenderPixelatedPass(4, scene, camera, {
      normalEdgeStrength: 0.2,
      depthEdgeStrength: 0.2,
    });
    composer.addPass(glitchPass);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.autoRotate = true;

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   wireframe: true,
    // });

    const loader = new GLTFLoader();

    loader.load(
      glb.ground,
      function (gltf) {
        gltf.scene.position.y = -1;
        gltf.scene.rotateX(Math.PI * 0.2);
        gltf.scene.rotateY(Math.PI * -0.2);
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );

    loader.load(
      glb.floor_one,
      function (gltf) {
        gltf.scene.position.y = -1;
        gltf.scene.rotateX(Math.PI * 0.2);
        gltf.scene.rotateY(Math.PI * -0.2);
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );

    loader.load(
      glb.floor_two,
      function (gltf) {
        gltf.scene.position.y = -1;
        gltf.scene.rotateX(Math.PI * 0.2);
        gltf.scene.rotateY(Math.PI * -0.2);
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );

    loader.load(
      glb.roof,
      function (gltf) {
        gltf.scene.position.y = -1;
        gltf.scene.rotateX(Math.PI * 0.2);
        gltf.scene.rotateY(Math.PI * -0.2);
        gltf.scene.receiveShadow = true;
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );

    this.zone.runOutsideAngular(() => {
      function animate() {
        requestAnimationFrame(animate);

        controls.update();

        render();
      }

      function render() {
        composer.render();
        // renderer.render(scene, camera);
      }

      animate();
    });
  }
}
