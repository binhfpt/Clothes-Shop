"use client"

import { useEditor, EditorContent, EditorContext } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { useEffect, useRef, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ImagePlus, Plus } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button/undo-redo-button"
import TiptapImage from '@tiptap/extension-image'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'

const CreateBlog = () => {

    const [form, setForm] = useState({
        title: "",
        tag: "",
        thumbnail: "",
        description: ""
    })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TiptapImage,
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error: any) => console.error('Upload failed:', error),
            }),
        ],
        content: `
        <p>Try typing something.</p>
        `,
        editorProps: {
            attributes: {
                class: "focus-visible:outline-none text-neutral-800  bg-blue-50 px-4 break-words pt-2 overflow-wrap-anywhere"
            }
        }
    })



    const handleFocus = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!editor) {
            console.warn("Editor not ready yet")
            return
        }
        editor.chain().focus().run()

        // const dom = editor.view?.dom
        // if (dom && typeof dom.focus === "function") dom.focus()
    }

    const handleCreateBlog = async () => {
        const html = editor?.getHTML()
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: html }),
        })
        // body: JSON.stringify({ content: html }),
        console.log(html)

    }

    const handleInputChange = (e: any) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className=' text-start pl-10 pt-5 justify-center max-w-full flex flex-col overflow-x-hidden pr-15 pb-50'>
            <h2 className='text-neutral-800 font-satoshi  mb-1'>Create a New Blog</h2>

            <input
                onChange={handleInputChange}
                name="title"
                value={form.title}
                type="text"
                placeholder="Title here..."
                className="text-3xl py-3 w-full bg-white pr-5 rounded-xl  text-neutral-600 font-satoshi font-semibold focus-visible:outline-none selection:bg-blue-50 selection:text-black"
            />
            <div className='flex gap-5 mb-5 items-center'>
                <div>
                    <Select value={form.tag}
                        onValueChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                tag: value
                            }))
                        }>
                        <SelectTrigger className="w-[180px] text-bg-btn-dynamic font-satoshi ">
                            <SelectValue placeholder="Select a Tag" />
                        </SelectTrigger>
                        <SelectContent className="text-bg-btn-dynamic">
                            <SelectGroup>
                                <SelectLabel>Tags</SelectLabel>
                                <SelectItem value="Sale">Sale</SelectItem>
                                <SelectItem value="Fashion">Fashion</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className=' border-2 border-bg-btn-dynamic  p-2 gap-2 rounded-xl cursor-pointer text-btn-hv-bg flex font-sans font-semibold '>
                    <ImagePlus />
                    Thumbnail
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className='border-2 border-gray-300 text-gray-400 cursor-pointer'>Show Thumbnail</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <Image
                            src="/pic/pexels-anna-nekrashevich-8532616.jpg"
                            alt="banner"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto object-cover"
                        />

                    </PopoverContent>
                </Popover>
            </div>


            <textarea
                onChange={handleInputChange}
                name="description"
                value={form.description}
                placeholder='Description here...' className='border-2 mb-5 text-neutral-800 pl-3 pt-1 text-xl w-full bg-[#ffffff] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300 rounded-sm h-[70px] border-neutral-300' />
            {editor && (
                <EditorContext.Provider value={{ editor }} >


                    <div onClick={handleFocus} className="border flex flex-col  border-gray-300 overflow-x-hidden overflow-y-scroll h-[400px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300">                        <div className="flex text-gray-900 py-1  px-2 bg-gray-200 items-center border-2 ">
                        <UndoRedoButton
                            editor={editor}
                            action="undo"
                            className="cursor-pointer"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                        />
                        <UndoRedoButton
                            editor={editor}
                            action="redo"
                            className="cursor-pointer"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                        />
                        <ImageUploadButton
                            editor={editor}
                            className="cursor-pointer"
                            hideWhenUnavailable={false}
                            showShortcut={false}
                            onInserted={() => console.log('Image inserted!')}
                        />
                        <BlockquoteButton
                            editor={editor}
                            hideWhenUnavailable={true}
                            showShortcut={false}
                            onToggled={() => console.log('Blockquote toggled!')}
                        />
                    </div>
                        <EditorContent
                            editor={editor}
                            className="w-full max-w-full [&_.ProseMirror]:w-full [&_.ProseMirror]:max-w-full"
                        />
                    </div>

                </EditorContext.Provider>
            )}
            <div className='flex gap-3 justify-end mt-15'>
                <Button onClick={() => console.log(form)} size={'lg'} className='bg-background border-2 border-gray-200 hover:bg-foreground text-text-tilte cursor-pointer font-normal'> Save Draft</Button>

                <Button onClick={handleCreateBlog} size={'lg'} className='bg-bg-btn-dynamic hover:bg-btn-hv-bg cursor-pointer'> <Plus size={16} />Create Blog</Button>

            </div>
        </div>
    )
}

export default CreateBlog