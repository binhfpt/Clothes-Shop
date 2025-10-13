"use client"
import React, { useRef, useEffect, useState } from 'react'
import { AppWindowIcon, Bold, Italic, Underline, BringToFront, CodeIcon, Copy, SendToBack, RectangleHorizontal, Circle, Trash2, Pen, PenOff, SprayCan, MousePointer, Palette, Moon, Sun, icons } from "lucide-react"
import * as fabric from 'fabric'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatButton } from '@/components/ui/chat-button'
const Fabric = () => {
    const canvasRef = useRef<fabric.Canvas | null>(null)
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [textColor, setTextColor] = useState("black")
    const [shapeColor, setShapeColor] = useState("black")
    const [activeTab, setActiveTab] = useState("upload")
    const [textStyle, setTextStyle] = useState<{
        bold: boolean,
        italic: boolean,
        underline: boolean
    }>({
        bold: false,
        italic: false,
        underline: false
    })

    const [colors, setColors] = useState(["black", "red", "green", "blue", "yellow", "orange"])
    const [penColor, setPenColor] = useState(colors[0])



    // useEffect khởi tạo canvas (chạy 1 lần duy nhất)
    useEffect(() => {
        if (canvasElRef.current && !canvasRef.current) {
            canvasRef.current = new fabric.Canvas(canvasElRef.current)
            canvasRef.current.on('selection:created', handleObjectSelection)
            canvasRef.current.on('selection:updated', handleObjectSelection)
            canvasRef.current.on('selection:cleared', () => {
                setTextStyle({ bold: false, italic: false, underline: false })
            })
        }

        return () => {
            canvasRef.current?.off('selection:created', handleObjectSelection)
            canvasRef.current?.off('selection:updated', handleObjectSelection)
            canvasRef.current?.off('selection:cleared')
            canvasRef.current?.dispose()
        }
    }, []); // Dependency array RỖNG - chỉ chạy 1 lần khi mount

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validImageTypes = {
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WebP',
            'image/svg+xml': 'SVG'
        }

        if (!Object.keys(validImageTypes).includes(file.type)) {
            alert(`File không hợp lệ!\n\nChỉ chấp nhận: ${Object.values(validImageTypes).join(', ')}\nFile của bạn: ${file.type || 'Không xác định'}`)
            e.target.value = ''
            return
        }

        // Validate file size (< 10MB)
        const maxSizeInMB = 10
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024
        const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2)

        if (file.size > maxSizeInBytes) {
            alert(`File quá lớn!\n\nKích thước tối đa: ${maxSizeInMB}MB\nFile của bạn: ${fileSizeInMB}MB`)
            e.target.value = ''
            return
        }

        console.log(`File hợp lệ: ${file.name} (${fileSizeInMB}MB)`)

        const canvas = canvasRef.current
        if (!canvas) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = (ev) => {
            const imageElement = document.createElement("img")
            imageElement.src = ev.target?.result as string

            imageElement.onload = function () {
                const image = new fabric.Image(imageElement)
                image.scaleToWidth(canvas.width! * 0.5)

                canvas.add(image)
                canvas.centerObject(image)
                canvas.setActiveObject(image)
                canvas.renderAll()

                console.log("Image added:", image.width, image.height)
                e.target.value = ''
            }

            imageElement.onerror = function () {
                alert("Không thể tải ảnh. File có thể bị lỗi!")
                e.target.value = ''
            }
        }

        reader.onerror = function () {
            alert("Lỗi khi đọc file!")
            e.target.value = ''
        }
    }

    function handleAddText(): void {
        const canvas = canvasRef.current;

        // Kiểm tra canvas đã khởi tạo chưa
        if (!canvas) {
            console.error("Canvas chưa được khởi tạo");
            return;
        }

        const itext = new fabric.IText("Click me to edit", {
            left: 80,
            top: 200,
            fontSize: 28,
            fill: textColor
        });


        canvas.add(itext);
        canvas.setActiveObject(itext); // Auto select text khi tạo
        canvas.renderAll(); // hoặc requestRenderAll() cũng OK
    }

    function handleChangeColor(e: React.ChangeEvent<HTMLInputElement>): void {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const newColor = e.target.value;
        const activeObjects = canvas.getActiveObjects();

        if (activeObjects.length === 0) {
            alert("Vui lòng chọn đối tượng để đổi màu!");
            return;
        }

        activeObjects.forEach((obj) => {
            if (obj.type === 'i-text' || obj.type === 'textbox' || obj.type === 'text') {
                obj.set('fill', newColor);
                setTextColor(newColor); // Update state sau
            } else if (obj.type === 'rect' || obj.type === 'ellipse') {
                obj.set('fill', newColor);
                setShapeColor(newColor);
            }
        });

        canvas.renderAll();
    }

    const addShape = (shape: string): void => {
        const canvas = canvasRef.current;
        if (canvas) {
            if (shape === "rect") {
                canvas.add(new fabric.Rect({
                    left: 100,
                    top: 80,
                    width: 50,
                    height: 50,
                    fill: shapeColor,
                    stroke: "#004d40",
                    strokeWidth: 0.5,
                    rx: 8,
                    ry: 8,
                    selectable: true,
                    hasControls: true,
                }));
            }
            else if (shape === "Ellipse") {
                canvas.add(new fabric.Ellipse({
                    left: 150,
                    top: 100,
                    rx: 50,
                    ry: 50,
                    fill: shapeColor,
                    stroke: "#0d47a1",
                    strokeWidth: 0.5,
                    selectable: true,
                    hasControls: true,
                }));

            }

        }
    }
    const deleteSelected = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const activeObjects = canvas.getActiveObjects(); // lấy tất cả object đang được chọn
            activeObjects.forEach((obj) => {
                canvas.remove(obj); // xóa object
            });
            canvas.discardActiveObject(); // bỏ chọn để không còn highlight
            canvas.renderAll(); // vẽ lại canvas
        }
    };



    // Hàm xử lý khi select object
    const handleObjectSelection = (e: any) => {
        const activeObject = e.selected?.[0]
        if (!activeObject) return

        if (activeObject.type === 'image') {
            setActiveTab('upload')
        } else if (activeObject.type === 'i-text' || activeObject.type === 'textbox' || activeObject.type === 'text') {
            setActiveTab('setting-text')

            const textObj = activeObject as fabric.IText;
            setTextStyle({
                bold: textObj.fontWeight === 'bold',
                italic: textObj.fontStyle === 'italic',
                underline: textObj.underline || false
            })
        } else if (activeObject.type === 'rect' || activeObject.type === 'ellipse') {
            setActiveTab('setting')
        }
    }

    const bringSelectedToForward = (canvas: fabric.Canvas) => {
        const activeObjs = canvas.getActiveObjects();
        activeObjs.forEach(obj => {
            canvas.bringObjectForward(obj);
        });
        canvas.renderAll();
    };

    const sendSelectedToBackWard = (canvas: fabric.Canvas) => {
        const activeObjs = canvas.getActiveObjects();
        activeObjs.forEach(obj => {
            canvas.sendObjectBackwards(obj);
        });
        canvas.renderAll();
    };

    const Duplicate = async (canvas: fabric.Canvas) => {
        const activeObjs = canvas.getActiveObjects();

        for (const obj of activeObjs) {
            try {
                const cloned = await obj.clone();
                cloned.set({
                    left: (obj.left || 0) + 20,
                    top: (obj.top || 0) + 20,
                });
                canvas.add(cloned);
            } catch (err) {
                console.error("Duplicate failed:", err);
            }
        }

        canvas.renderAll();
    };

    const toggleStyle = (style: "bold" | "italic" | "underline") => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const activeObj = canvas.getActiveObject();

        if (activeObj && (activeObj.type === "textbox" || activeObj.type === "i-text" || activeObj.type === "text")) {
            const textObj = activeObj as fabric.IText;

            // Toggle style trên object
            if (style === "bold") {
                const newValue = textObj.fontWeight !== "bold";
                textObj.set({ fontWeight: newValue ? "bold" : "normal" });
                setTextStyle(prev => ({ ...prev, bold: newValue }));
            } else if (style === "italic") {
                const newValue = textObj.fontStyle !== "italic";
                textObj.set({ fontStyle: newValue ? "italic" : "normal" });
                setTextStyle(prev => ({ ...prev, italic: newValue }));
            } else if (style === "underline") {
                const newValue = !textObj.underline;
                textObj.set({ underline: newValue });
                setTextStyle(prev => ({ ...prev, underline: newValue }));
            }

            canvas.renderAll();
        } else {
            alert("Vui lòng chọn text để áp dụng style!");
        }
    };

    const handleDrawing = (color: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.isDrawingMode = true;

            // chọn brush
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

            // chỉnh màu và độ dày nét
            canvas.freeDrawingBrush.color = penColor;
            canvas.freeDrawingBrush.width = 5;
        }
    };
    const handleUnDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.isDrawingMode = false;
        }
    };
    const handleSprayDrawing = (color: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
            canvas.freeDrawingBrush.color = penColor;
        }
    };

    const handleColorSideBar = (selColor: string) => {
        const canvas = canvasRef.current;

        setPenColor(selColor)
        if (canvas) {
            if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = selColor;
                canvas.requestRenderAll();
            }

        }
    }


    return (
        <div className="flex min-h-screen gap-15 bg-[linear-gradient(to_bottom,var(--primary),var(--secondary))]">

            <div className=" w-[60px] flex flex-col items-center gap-4 py-4 shadow-md rounded-r-xl bg-foreground relative">
                {/* Bring to Forward */}
                <Tooltip >
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center bg-lightground justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => canvasRef.current && bringSelectedToForward(canvasRef.current)}
                        >
                            <BringToFront className="cursor-pointer text-text-l" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right">
                        <p>Bring To Forward</p>
                    </TooltipContent>
                </Tooltip>

                {/* Send To Back */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-300 transition dark:hover:bg-gray-700 bg-lightground"
                            onClick={() => canvasRef.current && sendSelectedToBackWard(canvasRef.current)}
                        >
                            <SendToBack className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right">
                        <p>Send To Back</p>
                    </TooltipContent>
                </Tooltip>

                {/* Duplicate */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center bg-lightground justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => canvasRef.current && Duplicate(canvasRef.current)}
                        >
                            <Copy className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right" >
                        <p>Duplicate</p>
                    </TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center bg-lightground justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => deleteSelected()}
                        >
                            <Trash2 className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right" >
                        <p>Delete</p>
                    </TooltipContent>
                </Tooltip>

                {/* Draw */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center bg-lightground justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => handleDrawing(penColor)}
                        >
                            <Pen className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right" >
                        <p>Draw</p>
                    </TooltipContent>
                </Tooltip>

                {/* Spray */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 bg-lightground h-10 flex items-center justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => handleSprayDrawing(penColor)}
                        >
                            <SprayCan className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right" >
                        <p>Spray</p>
                    </TooltipContent>
                </Tooltip>

                {/* Select */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-10 h-10 flex bg-lightground items-center justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            onClick={() => handleUnDrawing()}
                        >
                            <MousePointer className='text-text-l' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className='text-white bg-black' side="right" >
                        <p>Select</p>
                    </TooltipContent>
                </Tooltip>

                {/* Color Picker */}
                <Popover>
                    <Tooltip >
                        <PopoverTrigger asChild>
                            <TooltipTrigger>
                                <div className='w-10 h-10 flex bg-lightground items-center justify-center rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition'>
                                    <Palette className='text-text-l ' />
                                </div>


                            </TooltipTrigger>
                        </PopoverTrigger>
                        <TooltipContent className='text-white bg-black' side="right" >
                            <p>Colors</p>
                        </TooltipContent>
                    </Tooltip>
                    <PopoverContent align="start">
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => handleColorSideBar(c)}
                                    className={`w-7 h-7 rounded-full ring-2 ${c === penColor ? "ring-black" : "ring-gray-200"
                                        }`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

            </div>

            <div className='w-[30%] '>
                <Tabs className='mt-6' value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex w-full rounded-lg">
                        <TabsTrigger
                            value="upload"

                        >
                            <p className='text-text'> Upload</p>
                        </TabsTrigger>

                        <TabsTrigger
                            value="text"

                        >
                            <p className='text-text'> Text</p>
                        </TabsTrigger>

                        <TabsTrigger
                            value="shape"

                        >
                            <p className='text-text'> Shape</p>
                        </TabsTrigger>

                        <TabsTrigger value="setting" className="hidden">
                            Setting
                        </TabsTrigger>
                        <TabsTrigger value="setting-text" className="hidden">
                            Setting text
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" >
                        <Card className='bg-foreground border-border shadow-2xl'>
                            <CardHeader >
                                <CardTitle className='text-2xl'>Upload pictures</CardTitle>
                                <CardDescription>
                                    Upload your pictures. Click add for it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">

                            </CardContent>
                            <CardFooter>
                                <Button className="border-l-10 mt-[-10]  border-tag  rounded-r-lg bg-primary-foreground cursor-pointer shadow-md hover:shadow-lg text-text-l" onClick={handleClick}>Uploads</Button>

                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="text">
                        <Card className='bg-foreground shadow-2xl'>
                            <CardHeader>
                                <CardTitle className='text-2xl'>Add Text</CardTitle>
                                <CardDescription>
                                    You can add your text in your tShirt
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">

                            </CardContent>
                            <CardFooter className=''>
                                <div className='flex flex-col gap-2'>
                                    <Button className="border-l-10 mt-[-10]  border-tag  rounded-r-lg bg-primary-foreground cursor-pointer shadow-md hover:shadow-lg text-text-l" onClick={handleAddText}>Add Text</Button>
                                </div>
                            </CardFooter>
                        </Card >
                    </TabsContent>
                    <TabsContent value="shape">
                        <Card className='bg-foreground shadow-2xl'>
                            <CardHeader>
                                <CardTitle className='text-2xl'>Add shapes</CardTitle>
                                <CardDescription>
                                    Add some shape to your TshirT
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">

                            </CardContent>
                            <CardFooter>
                                <div className="flex gap-3 mt-[-10]">
                                    <div
                                        onClick={() => addShape("rect")}
                                        className="p-2 rounded-full border  cursor-pointer transition bg-lightground"
                                    >
                                        <RectangleHorizontal className="w-6 h-6 text-text-l" />
                                    </div>
                                    <div
                                        onClick={() => addShape("Ellipse")}
                                        className="p-2 rounded-full border  cursor-pointer transition bg-lightground"
                                    >
                                        <Circle className="w-6 h-6 text-text-l" />
                                    </div>
                                </div>
                            </CardFooter>

                        </Card>
                    </TabsContent>
                    <TabsContent value="setting">
                        <Card className='bg-foreground'>
                            <CardHeader>
                                <CardTitle>Setting</CardTitle>
                                <CardDescription>
                                    You can edit something in here
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <Label>Color</Label>
                                <Input type='color' onChange={handleChangeColor} />

                            </CardContent>
                            <CardFooter >

                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="setting-text">
                        <Card className='bg-foreground'>
                            <CardHeader>
                                <CardTitle>Setting</CardTitle>
                                <CardDescription>
                                    You can edit something in here
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <Label>Color</Label>
                                <Input type='color' onChange={handleChangeColor} />
                                <div className='flex gap-2'>
                                    <Bold
                                        onClick={() => toggleStyle("bold")}
                                        className={`cursor-pointer p-1 rounded ${textStyle.bold ? "bg-gray-300" : ""}`}
                                    />
                                    <Italic
                                        onClick={() => toggleStyle("italic")}
                                        className={`cursor-pointer p-1 rounded ${textStyle.italic ? "bg-gray-300" : ""}`}
                                    />
                                    <Underline
                                        onClick={() => toggleStyle("underline")}
                                        className={`cursor-pointer p-1 rounded ${textStyle.underline ? "bg-gray-300" : ""}`}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter >

                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="w-[65%] ml-10 relative flex justify-center">
                <img
                    src="/96f660e3-56dd-4c01-85d7-3e7dbc107336.jpeg"
                    alt="bg"
                    className="w-full h-auto max-h-[100vh] object-contain"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dotted border-black">
                    <canvas ref={canvasElRef} width="200" height="250" />
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
            <ChatButton />
        </div>
    )
}

export default Fabric