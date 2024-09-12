import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./../../../../tailwind.css";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import dateFormat from "dateformat";
import { Icon } from "@fluentui/react/lib/Icon";

export interface INews {
    context: BaseWebPartContext;
    link: string;
    detailLink: string;
}
export const News: React.FunctionComponent<INews> = (props) => {

    const [categories, setCategories] = React.useState<any[]>(["Employee Communication", "Business Updates"]);
    const [news, setNews] = React.useState<any[]>();
    const [category, setCategory] = React.useState<string>("Employee Communication");
    const [loading, setLoading] = React.useState<boolean>(false);


    const fetchnewsChoices = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDTechNews")
            .fields.getByInternalNameOrTitle("Category")
            .select("Choices")();
        setCategories(p => results?.Choices);
        setCategory(results?.Choices[0]);
        setLoading(false);
    }

    const fetchnewsByCategory = async (categoryVal: string) => {
        if (categoryVal) {
            setLoading(false);
            const sp = spfi().using(SPFx(props.context));
            const results: any = await sp.web.lists
                .getByTitle("CBDTechNews")
                .items.filter(`Category eq '${categoryVal}' and Status eq 'Approved'`)
                .top(20)
                .orderBy('Modified', false)();
            setNews(results);
            setLoading(true);

        }
    }

    const fetchAll = async () => {
        await fetchnewsChoices();
    }



    React.useEffect(() => {
        fetchAll();
    }, []);

    React.useEffect(() => {
        fetchnewsByCategory(category);
    }, [category]);

    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: false,
            mode: "snap",
            rtl: false,
            slides: { perView: "auto", spacing: 20 },
        })



    return (

        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto pt-10 pb-16 news" style={{ "minHeight": "440px" }}>
            <div className="text-4xl text-gray1 font-bold px-2 pt-8 pb-4">News & Updates</div>
            {categories && news && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <ul className="flex gap-2 items-center flex-wrap">
                            {categories.map((c: string) => (
                                <li key={`category_${c}`} className="cursor-pointer">
                                    <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${category === c ? 'bg-primary text-white font-bold ' : 'text-primary bg-white'}`} onClick={() => setCategory(c)}  >{c}</a>
                                </li>
                            ))}
                        </ul>
                        <a className="w-fit font-bold text-base text-primary  flex-none flex gap-2 items-center" href={`${props.link}?env=WebView`} ><span>View All</span><Icon iconName="ChevronRight" /></a>
                    </div>
                    {loading && <div ref={sliderRef} className="keen-slider py-4">
                        {news?.map((n: any, index: number) => (
                            <div key={`slides_${index}`} className="keen-slider__slide h-1339 shadow-lg rounded-lg p-1" style={{ maxWidth: 330, minWidth: 330 }} >
                                <a href={`${props.detailLink}?env=WebView&NewsId=${n.Id}`}><img src={n.Thumbnail.Url} className="w-full h-1170 object-fill rounded-lg" /></a>
                                <p className="text-sm px-2 pt-4 pb-2 font-bold text-gray3">{dateFormat(n.PublishingDate, "d mmmm yy")} </p>
                                <a className="text-lg px-2 block text-gray1 overflow-hidden" href={`${props.detailLink}?env=WebView&NewsId=${n.Id}`}>
                                    {n.Summary ? (n.Summary.length > 75 ? `${n.Summary.substring(0, 75)}...` : n.Summary || '') : (n.Title.length > 75 ? `${n.Title.substring(0, 75)}...` : n.Title || '')}
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

