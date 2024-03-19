"use client";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, Theme, darkDefaultTheme, lightDefaultTheme, useCreateBlockNote  } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import React, { useEffect, useMemo, useState } from 'react'
import { UseFormReturn, useForm } from "react-hook-form";


// Base theme
const lightRedTheme = {
    colors: {
      editor: {
        text: "#222222",
        background: "#ffeeee",
      },
      menu: {
        text: "#ffffff",
        background: "#9b0000",
      },
      tooltip: {
        text: "#ffffff",
        background: "#b00000",
      },
      hovered: {
        text: "#ffffff",
        background: "#b00000",
      },
      selected: {
        text: "#ffffff",
        background: "#c50000",
      },
      disabled: {
        text: "#9b0000",
        background: "#7d0000",
      },
      shadow: "#640000",
      border: "#870000",
      sideMenu: "#bababa",
      highlights: lightDefaultTheme.colors!.highlights,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;
   
  // The theme for dark mode,
  // users the light theme defined above with a few changes
  const darkRedTheme = {
    ...lightRedTheme,
    colors: {
      ...lightRedTheme.colors,
      editor: {
        text: "#9B9B9B",
        background: "#09090A",
      },
      sideMenu: "#9B9B9B",
      highlights: darkDefaultTheme.colors!.highlights,
    },
  } satisfies Theme;

  const lightDarkTheme = {
    colors: {
      editor: {
        text: "#222222",
        background: "#1F1F22",
      },
      menu: {
        text: "#9B9B9B",
        background: "#1F1F22",
      },
      tooltip: {
        text: "#9B9B9B",
        background: "#1F1F22",
      },
      hovered: {
        text: "#09090A",
        background: "#676767",
      },
      selected: {
        text: "#000000",
        background: "#000000",
      },
      disabled: {
        text: "#9b0000",
        background: "#7d0000",
      },
      shadow: "#1F1F22",
      border: "#1F1F22",
      sideMenu: "#9B9B9B",
      highlights: darkDefaultTheme.colors!.highlights,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  const darkFormTheme = {
    ...lightDarkTheme,
    colors: {
      ...lightDarkTheme.colors,
      editor: {
        text: "#9B9B9B",
        background: "#1F1F22",
      },
      sideMenu: "#9B9B9B",
      highlights: darkDefaultTheme.colors!.highlights,
    },
  } satisfies Theme;
   
  // The combined "red theme",
  // we pass this to BlockNoteView and then the editor will automatically
  // switch between lightRedTheme / darkRedTheme based on the system theme
  const redTheme = {
    light: lightRedTheme,
    dark: darkRedTheme,
  };

const Editor = ( {content, onValueChange, isEditorUpdateRequired}:{content:string, onValueChange:(content:string)=>void, isEditorUpdateRequired:string}) => {

  console.log(content)
  const editor = content? useCreateBlockNote({initialContent:JSON.parse(content) as PartialBlock[]},[isEditorUpdateRequired]):useCreateBlockNote({},[isEditorUpdateRequired]);
  console.log(editor.document)
  
    return <BlockNoteView editor={editor} theme= {darkFormTheme} onChange={() => {
      console.log('updated editor')
      content= JSON.stringify(editor.document);
      onValueChange(content)

    }} />;
}

export default Editor

export const EditorView = ({content}:{content:string})=>{
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  useEffect(() => {
   
      setInitialContent(JSON.parse(content) as PartialBlock[]);

  }, []);



  var editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

 
  if (editor === undefined) {
    return "Loading content...";
  }
  if(initialContent!==JSON.parse(content) as PartialBlock[]) 
  {
    editor = BlockNoteEditor.create({ initialContent:JSON.parse(content) as PartialBlock[] });
  }
    return <BlockNoteView editor={editor} theme= {darkRedTheme} editable ={false} 

     />;

}