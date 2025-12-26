uniform vec3 mouse;
varying vec3 vPosition;
varying vec3 vColor;
uniform float time;

void main(){


    vec3 newPosition = position;
    vec3 noisePosition;

    float attractionForce = 200.0;
    float r = 100.0;
    float k = 0.0;

    noisePosition.x = attractionForce * snoise(vec4(position.x, position.y, position.z, time / 5000.0));
    noisePosition.y = newPosition.y + 10.0 * snoise(vec4(position.x, position.y, position.z, time / 5000.0));
    noisePosition.z = attractionForce * snoise(vec4(position.x * 0.5, position.y * 0.5, position.z * 0.5, time / 5000.0));

    if(length(position - mouse) < r){

        float kSquared = length(position - mouse) / r;
        k = sqrt(kSquared);
        newPosition *= vec3(1. + k,1.,2. + k);
        newPosition = mix(newPosition, noisePosition, k);
    }


    vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1. );
    gl_PointSize = 250. * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    vPosition = position;
    vColor = vec3(vec3(1.0) - normalize(noisePosition));
}