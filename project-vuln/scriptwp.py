import subprocess 
import optparse 
import os 
import psycopg2 # verificar por que ocurre esto 
from datetime import datetime 
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
from email import encoders 
# pruebas con https://perezhilton.com  https://titanesgraficos.com.ve/  mers@lccopen.tech
#wpscan --update --disable-tls-checks para actualizar 
# Recomendado: https://parzibyte.me/blog/2018/12/20/args-kwargs-python/

try:
    credenciales = {
        "dbname": "scanner",
        "user": "escaneoscript",
        "password": "admin",
        "host": "localhost",
        "port": 5432 # normalmente postgresql funciona con 5432 
    }
    conexion = psycopg2.connect(**credenciales)
except psycopg2.Error as e:
     print("Ocurrió un error al conectar a PostgreSQL: ", e)
 

# --------------Analisis de seguridad-----------------------------------------------------------
API_TOKEN = "q52YqiXoRe4tlgXefaLUmDuyASZ3Fsa8VH1sPxtsOa0" # api de Lugo miguel

parser = optparse.OptionParser() # para vincular comando 
parser.add_option("-u", "--url", dest = "url", help="Url del sitio web a escanear")
parser.add_option("-c", "--correo", dest = "correo", help="Correo donde  sera enviada la info")
(options,arguments) = parser.parse_args() # options = dest / arguments = -- and --coreo 
url = options.url 
correo =options.correo 


command = 'wpscan --url ' + url + ' --output vulnerabilidades.json --format json --api-token ' + API_TOKEN + ' --disable-tls-checks'   
os.system(command)
command_2 = 'python3 -m wpscan_out_parse vulnerabilidades.json'    
os.system(command_2)
command_3 = 'python3 -m wpscan_out_parse vulnerabilidades.json --format html> vulnerabilidades.html'    
os.system(command_3)

#----------- insertar en la BD el analisis generado ----------------------------------------------------
fecha_actual = datetime.now()

archivo2 = open('vulnerabilidades.json', "r")
archivo_json = archivo2.read() # guardo el contenido del json en la variable
archivo = open('vulnerabilidades.html', "r")
archivo_html = archivo.read() # guardo el contenido del html en la variable. 


try:
    with conexion.cursor() as cursor:
        consulta = "INSERT INTO reporte(date_created,url,file_json,file_html) VALUES (%s, %s, %s, %s);"
        cursor.execute(consulta, (fecha_actual,url,archivo_json,archivo_html))
        print("consulta realizada exitosamente")
    conexion.commit()  # Si no haces commit, los cambios no se guardan

except psycopg2.Error as e:
    print("Ocurrió un error al insertar: ", e)
finally:
    conexion.close()

#--------------- Enviar archivos por correo -----------------------------------------------------

fromaddr = "lccpasantia@gmail.com"

msg = MIMEMultipart() 
  
msg['From'] = fromaddr  
msg['To'] = correo 
msg['Subject'] = "Analisis de Vulnerabilidades"
# body = "Se encontraron las siguientes brechas de seguridad" 
archivo = open('vulnerabilidades.html', "r")
body =  archivo.read() # guardo el contenido del html en la variable. 
msg.attach(MIMEText(body, 'html'))

s = smtplib.SMTP('smtp.gmail.com', 587) 
s.starttls() # para cifrar la conexion 
s.login(fromaddr, "meketjamrcxahcdo") 
text = msg.as_string() 
s.sendmail(fromaddr, correo, text) 
print("email enviado")
  
s.quit() 

#-----------------------------------------------------------------------------
