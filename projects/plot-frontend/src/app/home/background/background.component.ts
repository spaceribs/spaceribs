import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import * as THREE from 'three';

@Component({
  standalone: true,
  selector: 'spaceribs-background',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
})
export class BackgroundComponent implements AfterViewInit {
  @ViewChild('renderBox') private readonly renderBox?: ElementRef;
  mouseDown = false;

  ngAfterViewInit(): void {
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xfafafa, 0, 3);

    const keyLight = new THREE.DirectionalLight(0xfafafa, 1);
    keyLight.position.set(-500, 500, 0).normalize();
    keyLight.castShadow = false;
    scene.add(keyLight);

    const camera = new THREE.PerspectiveCamera(50, 800 / 600, 1, 1000);
    camera.position.set(0, 2, 4);
    camera.rotation.set(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'low-power',
      alpha: true,
    });
    renderer.setSize(800, 600);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    const renderBox = this.renderBox?.nativeElement;

    if (renderBox == null) {
      throw new Error('No renderBox element found.');
    }

    renderBox.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(3, 64, 32);
    const map = new THREE.TextureLoader().load('assets/world-map.png');
    const material = new THREE.MeshStandardMaterial({
      map: map,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.x = Math.PI / 2;
    sphere.rotation.z = Math.PI / 2;
    scene.add(sphere);

    function animate() {
      requestAnimationFrame(animate);

      sphere.rotateOnAxis(new THREE.Vector3(0, 1, 1), -0.0001);

      render();
    }

    function render() {
      camera.aspect = window.innerHeight / window.innerWidth;
      renderer.render(scene, camera);
    }

    animate();
  }
}
