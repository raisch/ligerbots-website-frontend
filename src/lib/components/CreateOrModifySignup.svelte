<script>
    /**
     * Props
     */
    // /** @type {Record<string, any> | null} */
    /** @type {{ mode?: 'edit'|'create', collection?: string } | null } */
    export let Subject = null
    console.log(Subject)
</script>
<div>
   <div class="modifyBody">
         <h2>{Subject ? `${Subject.mode === 'edit' ? 'Edit' : 'Create'} ${Subject.collection?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : ''}</h2>
         <!-- Form fields would go here -->
         <button onclick={() => {/* Handle form submission */}}>Submit</button>
   </div>
</div>
<style>
    .modifyBody {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        position: absolute;
        width: 500px;
        height: auto;
        top: calc(50% - 100px);
        left: calc(50% - 250px);
        z-index: 5;
        /* transform: translate(50%, 50%); */
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