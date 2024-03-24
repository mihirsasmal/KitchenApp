"use client";
import { PartialBlock } from "@blocknote/core";
import { BlockNoteView, Theme, darkDefaultTheme, lightDefaultTheme, useCreateBlockNote  } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";


  const darkFormTheme = {
    colors: {
      editor: {
        text: "#9B9B9B",
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

  
  const lightFormTheme = {
    colors: {
      editor: {
        text: "#5C5C7B",
        background: "#DCDBDB",
      },
      menu: {
        text: "#5C5C7B",
        background: "#EFEFEF",
      },
      tooltip: {
        text: "#5C5C7B",
        background: "#DCDBDB",
      },
      hovered: {
        text: "#09090A",
        background: "#DCDBDB",
      },
      selected: {
        text: "#000000",
        background: "#000000",
      },
      disabled: {
        text: "#9b0000",
        background: "#7d0000",
      },
      shadow: "#DCDBDB",
      border: "#DCDBDB",
      sideMenu: "#A3A3B0",
      highlights: lightDefaultTheme.colors!.highlights,
    },
    borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

 


const Editor = ( {content, onValueChange, isEditorUpdateRequired, theme, editable}:{content:string, onValueChange:(content:string)=>void, isEditorUpdateRequired:string, theme:string, editable:boolean}) => {


  const editor = content? useCreateBlockNote({initialContent:JSON.parse(content) as PartialBlock[]},[isEditorUpdateRequired]):useCreateBlockNote({},[isEditorUpdateRequired]);

  
    return <BlockNoteView editor={editor} theme= {theme==='dark'?darkFormTheme:lightFormTheme} onChange={() => {

      content= JSON.stringify(editor.document);
      onValueChange(content)

    }}  editable ={editable}/>;
}

export default Editor
