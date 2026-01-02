<script>
    /**
     * Props
     */
    /** @type {Record<string, any> | null} */
    export let Subject = null
    console.log(Subject)
</script>
<div>
   <div class="modifyBody">
        hello
   </div>
</div>
<style>
    .modifyBody {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        position: absolute;
        width: 100px;
        height: 100px;
    }
    div {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #f9f9f9;
        display: flex;
        flex-wrap: wrap;
    }
    span {
        flex: 0 0 50%;
    }
</style>