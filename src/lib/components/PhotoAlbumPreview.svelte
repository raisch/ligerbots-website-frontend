<script>
    export let title;
    export let url;
    export let imageUrl;
</script>

<div class="gallery-thumbnail">
    <a href={url}>
        <img src={imageUrl} alt="Cover for {title}" class="w-full h-full"/>
    </a>
    <div class="gallery-caption">{title}</div>
</div>