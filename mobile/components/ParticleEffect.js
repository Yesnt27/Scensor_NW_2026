/**
 * ParticleEffect Component
 * Displays animated particles around the circle during detecting state
 * Particles slowly rotate around the circle
 * 
 * Props:
 *   - isActive: Boolean indicating if particles should be animated
 *   - circleSize: Size of the circle to position particles around
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const PARTICLE_COUNT = 200;
const PARTICLE_COLORS = [
    '#FFFFFF', '#F5F5F5', '#E8E8E8', '#DCDCDC', '#D0D0D0',
    '#C0C0C0', '#B0B0B0', '#A0A0A0', '#909090', '#808080',
    '#707070', '#606060', '#E0E0E0', '#F0F0F0', '#FAFAFA'
];

export default function ParticleEffect({ isActive, circleSize }) {
    const [particlePositions, setParticlePositions] = useState({});

    const particles = useRef(
        Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            // Uniform angle distribution around the circle
            const baseAngle = (360 / PARTICLE_COUNT) * i;
            // Small random offset for natural variation (max 5 degrees)
            const angle = baseAngle + (Math.random() - 0.5) * 10;

            // More uniform distance with slight variation - farther from circle
            const baseDistance = circleSize / 2 + 60;
            const distance = baseDistance + (Math.random() - 0.5) * 20;

            return {
                id: i,
                baseAngle: baseAngle,
                initialAngle: angle,
                distance: distance,
                size: 2 + Math.random() * 6,
                color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                rotation: new Animated.Value(angle),
                opacity: 0.6 + Math.random() * 0.4,
            };
        })
    ).current;

    useEffect(() => {
        if (isActive) {
            // Initialize positions
            const initialPositions = {};
            particles.forEach((particle) => {
                const angleRad = (particle.initialAngle * Math.PI) / 180;
                initialPositions[particle.id] = {
                    x: Math.cos(angleRad) * particle.distance,
                    y: Math.sin(angleRad) * particle.distance,
                };
            });
            setParticlePositions(initialPositions);

            // Create slow rotation animation for each particle
            const animations = particles.map((particle) => {
                // Each particle rotates at slightly different speeds for organic movement
                const rotationSpeed = 20000 + Math.random() * 10000; // 20-30 seconds per full rotation

                const animation = Animated.loop(
                    Animated.timing(particle.rotation, {
                        toValue: particle.initialAngle + 360,
                        duration: rotationSpeed,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    })
                );

                // Listen to rotation changes and update positions
                const listenerId = particle.rotation.addListener(({ value }) => {
                    const angleRad = (value * Math.PI) / 180;
                    setParticlePositions((prev) => ({
                        ...prev,
                        [particle.id]: {
                            x: Math.cos(angleRad) * particle.distance,
                            y: Math.sin(angleRad) * particle.distance,
                        },
                    }));
                });

                return { animation, listenerId, particle };
            });

            // Start all animations
            animations.forEach(({ animation }) => animation.start());

            return () => {
                // Cleanup: stop all animations and remove listeners
                animations.forEach(({ animation, listenerId, particle }) => {
                    animation.stop();
                    particle.rotation.removeListener(listenerId);
                    particle.rotation.setValue(particle.initialAngle);
                });
            };
        } else {
            // Reset all particles when not active
            particles.forEach((particle) => {
                particle.rotation.stopAnimation();
                particle.rotation.setValue(particle.initialAngle);
            });
            setParticlePositions({});
        }
    }, [isActive, particles, circleSize]);

    if (!isActive) return null;

    return (
        <View style={[styles.container, { width: circleSize + 150, height: circleSize + 150 }]}>
            {particles.map((particle) => {
                const position = particlePositions[particle.id] || { x: 0, y: 0 };

                return (
                    <View
                        key={particle.id}
                        style={[
                            styles.particle,
                            {
                                width: particle.size,
                                height: particle.size,
                                borderRadius: particle.size / 2,
                                backgroundColor: particle.color,
                                opacity: particle.opacity,
                                left: '50%',
                                top: '50%',
                                marginLeft: position.x - particle.size /2,
                                marginTop: position.y - particle.size / 2,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    particle: {
        position: 'absolute',
    },
});
