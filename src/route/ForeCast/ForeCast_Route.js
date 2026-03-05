import ForCast_Editor from "../../pages/SubComponents/ForeCast/Forcast_Editor/ForCast_Editor";
import ForCast_Viewer from "../../pages/SubComponents/ForeCast/ForCast_Viewer/ForCast_Viewer";


export const ForeCast_Route = [
    {
        path:"forecast-editor",
        Component:ForCast_Editor
    },
    {
        path:"forecast-viewer",
        Component:ForCast_Viewer
    }
]