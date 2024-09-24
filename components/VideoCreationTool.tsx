"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Image as ImageIcon, Video as VideoIcon, Settings, Check, Maximize2 } from 'lucide-react';


const SAMPLE_SCRIPT = `第1段：春天来了，樱花盛开。粉色的花瓣在微风中轻轻飘落，像是一场美丽的花雨。

第2段：夏日的海滩上，金色的阳光洒在细腻的沙粒上。海浪轻轻拍打着岸边，带来阵阵清凉。

第3段：秋天的公园里，枫叶铺满了小径。孩子们在落叶堆里嬉戏，欢声笑语回荡在空中。

第4段：冬日的雪山上，白雪皑皑。滑雪者在山坡上飞驰而下，留下一道道优美的弧线。

第5段：城市的夜晚，霓虹灯闪烁。车水马龙中，人们匆匆而过，每个人都有自己的故事。

第6段：清晨的乡村，雾气缭绕。田野里，农民们已经开始了一天的劳作，勤劳的身影映衬着朝阳。

第7段：图书馆里，安静祥和。学生们埋头苦读，书页翻动的声音仿佛是对知识的渴望。

第8段：篮球场上，激烈的比赛正在进行。运动员们挥汗如雨，为胜利而奋斗。

第9段：实验室里，科学家们专注地工作着。显微镜下，他们探索着未知的世界，追求科技的进步。

第10段：音乐会现场，交响乐团正在演奏。美妙的旋律充满整个大厅，观众们沉醉其中。`;

interface ImageButtonProps {
    label: string;
    onClick: () => void;
}

const ImageButton: React.FC<ImageButtonProps> = ({ label, onClick }) => (
    <Button size="sm" variant="outline" onClick={onClick} className="p-1">
        {label}
    </Button>
);

interface ImagePreviewProps {
    src: string;
    onButtonClick: (label: string) => void;
    isSmallImage: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onButtonClick, isSmallImage }) => {
    const [showButtons, setShowButtons] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
        >
            <Image src={src} alt="Preview" layout="fill" objectFit="cover" />
            {showButtons && isSmallImage && (
                <div className="absolute bottom-2 right-2 grid grid-cols-4 gap-1">
                    {['V1', 'V2', 'V3', 'V4', 'U1', 'U2', 'U3', 'U4'].map(label => (
                        <ImageButton key={label} label={label} onClick={() => onButtonClick(label)} />
                    ))}
                </div>
            )}
            <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 p-1"
                onClick={() => {/* Implement zoom functionality */ }}
            >
                <Maximize2 size={16} />
            </Button>
        </div>
    );
};

interface Scene {
    id: number;
    text: string;
    description: string;
    mjInteractions: number;
    hasImage: boolean;
    hasVideo: boolean;
    images: string[];
    selectedImage: number | null;
    video: string | null;
}

const VideoCreationTool: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [script, setScript] = useState<string>(SAMPLE_SCRIPT);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const steps = ['Script Input', 'Scene Editing', 'Preview'];

    const handleSplitScenes = useCallback(() => {
        const splitScenes = script.split('\n\n').filter(scene => scene.trim() !== '');
        setScenes(splitScenes.map((text, index) => ({
            id: index + 1,
            text,
            description: '',
            mjInteractions: 0,
            hasImage: false,
            hasVideo: false,
            images: Array(4).fill('/api/placeholder/150/150'),
            selectedImage: null,
            video: null
        })));
    }, [script]);

    useEffect(() => {
        if (activeStep === 1 && scenes.length === 0) {
            handleSplitScenes();
        }
    }, [activeStep, scenes.length, handleSplitScenes]);

    const handleNextStep = () => {
        setActiveStep(prevStep => Math.min(steps.length - 1, prevStep + 1));
    };

    const handlePrevStep = () => {
        setActiveStep(prevStep => Math.max(0, prevStep - 1));
    };

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setScript(e.target.value);
    };

    const handleSceneUpdate = (id: number, field: keyof Scene, value: Scene[keyof Scene]) => {
        setScenes(prevScenes => prevScenes.map(scene =>
            scene.id === id ? { ...scene, [field]: value } : scene
        ));
    };

    const handleGenerateImages = (id: number) => {
        // Simulate image generation
        const newImages = Array(4).fill('/api/placeholder/150/150');
        handleSceneUpdate(id, 'images', newImages);
        handleSceneUpdate(id, 'hasImage', true);
        handleSceneUpdate(id, 'mjInteractions', (scenes.find(s => s.id === id)?.mjInteractions || 0) + 1);
    };

    const handleSelectImage = (id: number, index: number) => {
        handleSceneUpdate(id, 'selectedImage', index);
    };

    const handleGenerateVideo = (id: number) => {
        // Simulate video generation
        handleSceneUpdate(id, 'video', '/api/placeholder/300/200');
        handleSceneUpdate(id, 'hasVideo', true);
    };

    const handleGenerateAllImages = () => {
        scenes.forEach(scene => {
            if (!scene.hasImage) {
                handleGenerateImages(scene.id);
            }
        });
    };

    const handleGenerateAllVideos = () => {
        scenes.forEach(scene => {
            if (scene.hasImage && !scene.hasVideo) {
                handleGenerateVideo(scene.id);
            }
        });
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Card>
                        <CardHeader className="flex flex-row items-end justify-between space-y-0 pb-2">
                            <h2 className="text-xl font-bold">Enter Your Script</h2>
                            <div className="text-sm text-gray-500">
                                字数：{script.length}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={script}
                                onChange={handleScriptChange}
                                placeholder="Enter your script here..."
                                className="w-full p-2 border rounded h-96"
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleNextStep}>
                                Split into Scenes <ArrowRight className="ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                );
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Scene Editing</h2>
                            <div>
                                <Button onClick={handleGenerateAllImages} className="mr-2">
                                    Generate All Images
                                </Button>
                                <Button onClick={handleGenerateAllVideos}>
                                    Generate All Videos
                                </Button>
                            </div>
                        </div>
                        {scenes.map((scene) => (
                            <Card key={scene.id}>
                                <CardHeader>
                                    <CardTitle>Scene {scene.id}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={scene.text}
                                        onChange={(e) => handleSceneUpdate(scene.id, 'text', e.target.value)}
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                    <Input
                                        value={scene.description}
                                        onChange={(e) => handleSceneUpdate(scene.id, 'description', e.target.value)}
                                        placeholder="Scene description"
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                    <div className="flex space-x-2 mb-2">
                                        <Button onClick={() => handleGenerateImages(scene.id)} disabled={scene.hasImage}>
                                            {scene.hasImage ? <Check className="mr-2" /> : <ImageIcon className="mr-2" />}
                                            Generate Images
                                        </Button>
                                        <Button onClick={() => handleGenerateVideo(scene.id)} disabled={!scene.hasImage || scene.hasVideo}>
                                            {scene.hasVideo ? <Check className="mr-2" /> : <VideoIcon className="mr-2" />}
                                            Generate Video
                                        </Button>
                                    </div>
                                    {scene.hasImage && (
                                        <div className="flex space-x-4 mb-2">
                                            <div className="w-1/2 grid grid-cols-2 gap-0" style={{ aspectRatio: '1/1' }}>
                                                {scene.images.map((img, index) => (
                                                    <ImagePreview
                                                        key={index}
                                                        src={img}
                                                        isSmallImage={true}
                                                        onButtonClick={() => handleSelectImage(scene.id, index)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="w-1/2" style={{ aspectRatio: '1/1' }}>
                                                <Image
                                                    src={scene.images[scene.selectedImage || 0]}
                                                    alt="Selected Preview"
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-sm mt-1">MJ Interactions: {scene.mjInteractions}</p>
                                    {scene.hasVideo && scene.video && (
                                        <div className="mt-2">
                                            <video src={scene.video} controls className="w-full h-40 object-cover">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );
            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="font-bold mb-2">Timeline</p>
                                <div className="flex items-center space-x-2 overflow-x-auto">
                                    {scenes.map((scene) => (
                                        <div key={scene.id} className="w-20 h-20 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                            Scene {scene.id}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="font-bold mb-2">Scene Duration</p>
                                <Slider defaultValue={[5]} max={10} step={1} />
                            </div>
                            <Button>
                                Generate Final Video <VideoIcon className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Video Creation Tool</h1>
            <div className="mb-4">
                <p className="font-bold">Current Step: {steps[activeStep]}</p>
            </div>
            {renderStep()}
            <div className="mt-4 flex justify-between items-center">
                <Button variant="outline" onClick={handlePrevStep} disabled={activeStep === 0}>
                    Previous Step
                </Button>
                <Settings className="cursor-pointer" />
                <Button variant="outline" onClick={handleNextStep} disabled={activeStep === steps.length - 1}>
                    Next Step
                </Button>
            </div>
        </div>
    );
};

export default VideoCreationTool;