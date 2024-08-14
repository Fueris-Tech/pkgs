import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import dateFormat from "dateformat";

export interface ICommunications {
    context: BaseWebPartContext;
    count: number;
    link: string;
    detailLink: string;
}
export const Communications: React.FunctionComponent<ICommunications> = (props) => {

    const [categories, setCategories] = React.useState<any[]>();
    const [communications, setCommunications] = React.useState<any[]>();
    const [category, setCategory] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchcommunicationChoices = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDCommunication")
            .fields.getByInternalNameOrTitle("Category")
            .select("Choices")();
        setCategories(p => results?.Choices);
        setCategory(results?.Choices[0]);
        setLoading(false);
    }

    const fetchcommunicationByCategory = async (categoryVal: string) => {
        if (categoryVal) {
            setLoading(false);
            const sp = spfi().using(SPFx(props.context));
            const results: any = await sp.web.lists
                .getByTitle("CBDCommunication")
                .items.filter(`Category eq '${categoryVal}' and Status eq 'Approved'`)
                .orderBy('Modified', false)();
            setCommunications(results);
            setLoading(true);
        }
    }

    const fetchAll = async () => {
        await fetchcommunicationChoices();
    }



    React.useEffect(() => {
        fetchAll();
    }, []);

    React.useEffect(() => {
        fetchcommunicationByCategory(category);
    }, [category]);


    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: false,
            mode: "snap",
            rtl: false,
            slides: { perView: "auto", spacing: 20 },
        })

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto pt-10 pb-20 communication">
            <div className="text-4xl text-gray1 font-bold px-2 py-8">Colleague Communications</div>
            {categories && communications && (
                <div className="flex flex-col gap-4">
                    <ul className="flex gap-2 items-center flex-wrap">
                        {categories.map((c: string) => (
                            <li key={`category_${c}`} className="cursor-pointer">
                                <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${category === c ? 'bg-primary text-white font-bold ' : 'text-primary bg-white'}`} onClick={() => setCategory(c)}  >{c}</a>
                            </li>
                        ))}
                    </ul>
                    {loading && <div ref={sliderRef} className="keen-slider py-4">
                        {communications?.map((communication: any, index: number) => (
                            <div key={`slides_${index}`} className="keen-slider__slide h-440 shadow-lg rounded-lg p-1" style={{ maxWidth: 330, minWidth: 330 }} >
                                <a href={`${props.detailLink}?CommsId=${communication.Id}`}><img src={communication.Thumbnail.Url} className="w-full h-1220 object-cover rounded-lg" /></a>
                                <p className="text-sm px-2 py-4 font-bold text-gray3">{dateFormat(communication.Modified, "d mmmm yy")} </p>
                                <a className="text-lg px-2 block text-gray1 overflow-hidden" href={`${props.detailLink}?CommsId=${communication.Id}`}>
                                    {communication.Summary.length > 50 ? `${communication.Summary.substring(0, 50)}...` : communication.Summary}
                                </a>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            )}
        </div>
    )
}

