# Playground

<!-- single file component -->
<style>
form {
  display: flex;
  flex-flow: row wrap;
  background:black;
  border:3px solid black;
  border-radius: 3px;
  width: 1020px;
}

#preview {
  flex: 1;
  overflow: scroll;
  min-height: 300px;
  background:lightblue;
  color:darkblue;
  border:none;
  padding: 0 0 0 20px;
}

textarea {
  flex:0;
  padding: 20px;
  min-height:200px;
  margin:0;
  background: black;
  color: cyan;
  border: none;
  font-size: 1.3em;
}

button {
  flex: 1 100%;
}
</style>

<form action=/api/1/package>
  <div>
<textarea name=arc>
@app
testapp
@http
get /
</textarea>
    <div id=tree>loading src...</div>
  </div>
  <div id=preview></div>
  <button type=submit>arc package</button>
</form>

<script type=module src=/intro/playground.js></script>
